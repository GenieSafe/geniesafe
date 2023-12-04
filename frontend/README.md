## Developer guide

### Branching workflow

#### Regular branches

- Available permanently in the repo
- **Do not** delete these branches

##### 1. `main`

- Stable, deployment branch
- Merged with `dev` at the end of a major/minor release
- **Do not** directly commit to this branch

##### 2. `dev`

- Development branch
- Main branch used in development
- Branches off to other branches

#### Temporary branches

- Available throughout a development period for a particular user story/task
- To be deleted **after** pull request (PR) is approved
- Refer below to see how to name these types of branches

##### Categories

- `feat` is for adding, refactoring or removing a feature
- `fix` is for fixing a bug
- `test` is for experimenting outside of an issue/ticket

##### Reference

Insert Jira issue number, either user story or task. If there's no reference, just add `no-ref`.

##### Description

Insert a brief description which sums up the purpose of this specific branch. This description should be short and "kebab-cased".

By default, you can use the title of the issue/ticket you are working on. Just replace any special character by "-".

#### Naming pattern
```bash
git checkout -b <category>/<issue-no>/<description-in-kebab-case>
```

##### Examples

- You need to add, refactor or remove a feature: `git branch feat/WIE-42/create-new-button-component`
- You need to fix a bug: `git branch bugfix/WIE-342/button-overlap-form-on-mobile`
- You need to fix a bug really fast (possibly with a temporary solution): `git branch fix/no-ref/registration-form-not-working`
- You need to experiment outside of an issue/ticket: `git branch test/no-ref/refactor-components-with-atomic-design`