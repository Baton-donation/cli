import {Hook} from '@oclif/config';
import * as path from 'path';

const hook: Hook<'init'> = async function (options) {
	// Load environment variables
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('dotenv').config({path: path.join(__dirname, '../../.env')});
};

export default hook;
