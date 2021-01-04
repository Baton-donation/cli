import * as path from 'path';
import * as fs from 'fs';
import {Command, flags} from '@oclif/command';
import * as sodium from 'libsodium-wrappers';

export default class KeysGenerate extends Command {
	static description = 'generates a new public/private keypair';

	static flags = {
		outDir: flags.string({char: 'o', default: './', description: 'directory to save keypair to'}),
		name: flags.string({char: 'n', default: 'baton', description: 'name of keypair'})
	};

	async run() {
		const {flags} = this.parse(KeysGenerate);

		await sodium.ready;

		const keys = sodium.crypto_box_keypair();

		const publicKeyString = Buffer.from(keys.publicKey).toString('base64');
		const privateKeyString = Buffer.from(keys.privateKey).toString('base64');

		const publicKeyPath = path.join(flags.outDir, `${flags.name}.public`);
		const privateKeyPath = path.join(flags.outDir, `${flags.name}.private`);

		await Promise.all([
			fs.promises.writeFile(publicKeyPath, publicKeyString),
			fs.promises.writeFile(privateKeyPath, privateKeyString)
		]);

		this.log(`Keypair generated and saved in ${flags.outDir}.`);
	}
}
