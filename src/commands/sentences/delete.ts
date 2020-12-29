import {Command} from '@oclif/command';
import APIClient from '../../lib/api';
import * as uuid from 'uuid';

export default class DeleteSentence extends Command {
	static description = 'delete a sentence by UUID';

	static args = [{name: 'uuid'}];

	async run() {
		const {args} = this.parse(DeleteSentence);

		if (!uuid.validate(args.uuid)) {
			throw new Error('Invalid UUID.');
		}

		const api = new APIClient();

		await api.deleteSentence(args.uuid);
	}
}
