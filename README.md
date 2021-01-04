# @baton/cli

A CLI for Baton's backend.

## Usage

[Download a recent release](https://github.com/Baton-donation/cli/releases).

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
