import {Command} from '@oclif/command';
import APIClient from '../../lib/api';

export default class CreateUnlockCode extends Command {
	static description = 'creates a new random unlock code';

	static args = [{name: 'authToken', description: 'authentication token for API', required: true}];

	async run() {
		const {args} = this.parse(CreateUnlockCode);

		const api = new APIClient();
		const {code} = await api.createUnlockCode(args.authToken);

		console.log(code);
	}
}
