import {Command} from '@oclif/command';
import * as ora from 'ora';
import * as fs from 'fs';
import * as ndjson from 'ndjson';
import APIClient from '../../lib/api';

export default class FetchUserDetails extends Command {
	static description = 'downloads encrypted user details from database';

	static args = [{name: 'out', description: 'output file path', required: true}];

	async run() {
		const {args} = this.parse(FetchUserDetails);

		const spinner = ora('Downloading...').start();

		const api = new APIClient();

		const users = await api.getAllUserDetails();

		const out = fs.createWriteStream(args.out);

		const s = ndjson.stringify();
		s.on('data', line => out.write(line));

		users.forEach(user => s.write(user));
		s.end();

		spinner.succeed(`Download finished! Saved to ${args.out as string}.`);
	}
}
