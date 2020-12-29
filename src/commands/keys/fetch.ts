import {Command} from '@oclif/command';
import APIClient from '../../lib/api';

export default class KeysFetch extends Command {
	static description = 'fetches the stored public key from the backend';

	async run() {
		const api = new APIClient();

		this.log(await api.getPublicKey());
	}
}
