import {Command, flags} from '@oclif/command';
import * as fs from 'fs';
import * as ndjson from 'ndjson';
import * as sodium from 'libsodium-wrappers';
import * as ora from 'ora';

export default class DecryptUserDetails extends Command {
	static description = 'decrypt a user details';

	static examples = [
		'$ baton user-details:decrypt encrypted_dump.ndjson decrypted_dump.ndjson --privateKeyPath=baton.private --publicKeyPath=baton.public'
	];

	static args = [{name: 'encryptedPath', required: true}, {name: 'outPath', required: true}];
	static flags = {
		privateKeyPath: flags.string({description: 'path to private key file (.private)', required: true}),
		publicKeyPath: flags.string({description: 'path to public key file (.public)', required: true})
	};

	async run() {
		const {args, flags} = this.parse(DecryptUserDetails);

		// Check arguments
		try {
			await fs.promises.access(flags.privateKeyPath);
		} catch {
			throw new Error('Invalid path to private key.');
		}

		try {
			await fs.promises.access(flags.publicKeyPath);
		} catch {
			throw new Error('Invalid path to public key.');
		}

		try {
			await fs.promises.access(args.encryptedPath);
		} catch {
			throw new Error('Invalid path to encrypted dump.');
		}

		const spinner = ora('Decrypting user details...').start();

		await sodium.ready;

		// Decrypt
		const privateKeyEncoded = await fs.promises.readFile(flags.privateKeyPath);
		const publicKeyEncoded = await fs.promises.readFile(flags.publicKeyPath);

		const privateKey = Buffer.from(privateKeyEncoded.toString(), 'base64');
		const publicKey = Buffer.from(publicKeyEncoded.toString(), 'base64');

		const out = fs.createWriteStream(args.outPath);

		await new Promise<void>((resolve, reject) => {
			fs.createReadStream(args.encryptedPath)
				.pipe(ndjson.parse())
				.on('data', (user: {encryptedData: string}) => {
					const {encryptedData, ...userWithoutData} = user;

					const decrypted = sodium.crypto_box_seal_open(Buffer.from(encryptedData, 'base64'), publicKey, privateKey);

					const result = {...userWithoutData, data: JSON.parse(Buffer.from(decrypted).toString())};

					out.write(`${JSON.stringify(result)}\n`);
				})
				.on('error', error => {
					spinner.fail('Could not decrypt user details.');
					reject(error);
				})
				.on('end', () => {
					spinner.succeed(`Decrypted user details wrote to ${args.outPath as string}.`);
					out.end();
					resolve();
				});
		});
	}
}
