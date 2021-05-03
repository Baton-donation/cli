# @baton/cli

A CLI for Baton's backend.

## Usage

[Download a recent release](https://github.com/Baton-donation/cli/releases). You'll probably have to execute `chmod +x cli-{platform}` on the binary before you can execute it.

On macOS, you'll have to "trust" it as well by right-clicking on it in Finder and clicking "Open." You can then go back to the terminal of your choice and use it as usual.

## Development

Copy `.env.example` to `.env` and update as necessary. Then:

```bash
# install dependencies
yarn install

# build and watch for changes
yarn build:watch

# in another window, run
./bin/run help
```

To create a new release, run `npm version [patch|minor|major]`, then `git push && git push --tags`. A new release will automatically be created if all checks pass.
