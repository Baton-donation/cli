import {Command} from '@oclif/command';
import * as ora from 'ora';
import * as fs from 'fs';
import * as stream from 'stream';
import * as zlib from 'zlib';
import {promisify} from 'util';
import APIClient from '../../lib/api';

const pipeline = promisify(stream.pipeline);

export default class FetchSentences extends Command {
	static description = 'downloads encrypted sentences from database';

	static args = [{name: 'out', description: 'output file path', required: true}];

	async run() {
		const {args} = this.parse(FetchSentences);

		const out = fs.createWriteStream(args.out);

		const spinner = ora('Creating download...').start();

		const api = new APIClient();

		const downloadId = await api.createDownload();

		spinner.text = 'Preparing download... (0%)';

		// Wait for download to be ready
		await new Promise<void>((resolve, reject) => {
			const interval = setInterval(async () => {
				const progress = await api.getDownloadProgress(downloadId);

				spinner.text = `Preparing download... (${progress * 100}%)`;

				if (progress === 1) {
					clearInterval(interval);
					resolve();
				} else if (progress === -1) {
					spinner.fail('Download errored out on server.');
					reject(new Error());
				}
			}, 1000);
		});

		spinner.text = 'Downloading...';

		const request = await api.getDownload(downloadId);

		await pipeline(request, zlib.createGunzip(), out);

		spinner.succeed(`Download finished! Saved to ${args.out as string}.`);
	}
}
