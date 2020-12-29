import * as crypto from 'crypto';
import * as util from 'util';
import * as path from 'path';
import * as fs from 'fs';
import {Command, flags} from '@oclif/command';

const generateKeyPair = util.promisify(crypto.generateKeyPair);

export default class KeysGenerate extends Command {
	static description = 'generates a new public/private keypair';

	static flags = {
		outDir: flags.string({char: 'o', default: './', description: 'directory to save keypair to'}),
		name: flags.string({char: 'n', default: 'baton', description: 'name of keypair'})
	};

	async run() {
		const {flags} = this.parse(KeysGenerate);

		const {publicKey, privateKey} = await generateKeyPair('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: {
				type: 'pkcs1',
				format: 'pem'
			},
			privateKeyEncoding: {
				type: 'pkcs1',
				format: 'pem'
			}
		});

		const publicKeyPath = path.join(flags.outDir, `${flags.name}.pub`);
		const privateKeyPath = path.join(flags.outDir, `${flags.name}.pem`);

		await Promise.all([
			fs.promises.writeFile(publicKeyPath, publicKey),
			fs.promises.writeFile(privateKeyPath, privateKey)
		]);

		this.log(`Keypair generated and saved in ${flags.outDir}.`);
	}
}
