# GenieSafe
Built by [Alif](https://github.com/alifmazli) and [Syaamil](https://github.com/escornbar)

## Getting Started

Use Yarn to avoid dependency collisions: [Yarn](https://classic.yarnpkg.com/en/docs/install)

```bash
git clone https://github.com/GenieSafe/geniesafe.git
cd geniesafe

yarn install

# Start up the Hardhat Network
yarn chain
```

Here we just install the npm project's dependencies, and by running `yarn chain` we spin up an instance of Hardhat Network that you can connect to using MetaMask. In a different terminal in the same directory, run:

```bash
yarn deploy
```

This will deploy the contract to Hardhat Network. After this completes run:

```bash
cd frontend
yarn install
```

This will install the frontend packages. We also need to set up the local configuration file.

```bash
cp .env.local.example .env.local
```

This will create a file called `.env.local`. Open up that file and fill in the environment variables.

```bash
yarn dev
```

This will start up the Next.js development server. Your site will be available at http://localhost:3000/

To interact with the local contract, be sure to switch your MetaMask Network to `Localhost 8545`

## Development Conventions

### Branching workflow

#### Regular branches

- Available permanently in the repo
- **Do not** delete these branches

##### 1. `main`

- Stable, deployment branch
- Merged with `develop` at the end of a major/minor version release
- Example: After code review for GenieSafe 1.0 is completed
- **Do not** directly commit to this branch

##### 2. `develop`

- Development branch
- Main branch used in development
- Branches off to other `user_story` and `task` branch

#### Temporary branches

- Available throughout a development period for a particular user story/task
- To be deleted **after** pull request (PR) is approved
- Refer below to see how to name these types of branches

##### Categories

- `feature` is for adding, refactoring or removing a feature
- `bugfix` is for fixing a bug
- `hotfix` is for changing code with a temporary solution and/or without following the usual process (usually because of an emergency)
- `test` is for experimenting outside of an issue/ticket

##### Reference

Insert Jira issue number, either user story or task. If there's no reference, just add `no-ref`.

##### Description

Insert a brief description which sums up the purpose of this specific branch. This description should be short and "kebab-cased".

By default, you can use the title of the issue/ticket you are working on. Just replace any special character by "-".

#### Naming pattern
```bash
git checkout -b <category>/<reference>/<description-in-kebab-case>
```

##### Examples

- You need to add, refactor or remove a feature: `git branch feature/issue-42/create-new-button-component`
- You need to fix a bug: `git branch bugfix/issue-342/button-overlap-form-on-mobile`
- You need to fix a bug really fast (possibly with a temporary solution): `git branch hotfix/no-ref/registration-form-not-working`
- You need to experiment outside of an issue/ticket: `git branch test/no-ref refactor-components-with-atomic-design`
