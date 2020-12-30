import {Hook} from '@oclif/config';

const hook: Hook<'init'> = async function (options) {
	// Load environment variables
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('dotenv').config();
};

export default hook;
