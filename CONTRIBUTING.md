# Introduction

Thank you for considering contributing to Neotoma's API development. It's people like you that make Neotoma such a great community.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

Improving documentation, bug triaging, or writing tutorials are all examples of helpful contributions that mean less work for the developers.  If you wish to make any of these contributions please read on.

## Working with `git`

There are two main branches, `production` and `develop`.  `production` is intended to be the production branch, while `develop` is the main testing and development branch. We encourage developers to use a GitFlow model of development, building from the `develop` branch, and creating new branches for features and fixes, that are then merged back to the `develop` branch.

![Illustrating the model for 'gitflow' within this repository.](assets/gitflow_model.svg)

The GitFlow model we use involves first making a branch from `production`, or ensuring that `devel` is at the same commit as `production`. From there we can branch from `devel` to create a new feature, or a hotfix. Each of these will be named and given some clear identifier as to their purpose. For example, adding a new API endpoint for speleothems would go into `feature/speleothemendpoint`. This allows the repository manager to understand what is happening in the repository at all times.

On completion of a feature or hotfix, we would prefer that the user make a Pull Request to the `devel` branch, to close their working branch. Once `devel` has been tested and accepted, we will make a pull request to `production` and the feature will be deployed.

## Code Style

Ideally you should be using a linter when you code. We use [`eslint`](https://eslint.org/) with the following content in `.eslintrc.json`:

```json
{
    "extends": ["strongloop", "eslint-config-google"],
    "env":{"node":true, "mocha":true, "es6":true},
    "parserOptions": { "ecmaVersion": 2018 }
}
```

The code in this repository has been developed over a number of years. We would greatly appreciate fixes to the code to improve overall readability and style.

## Promises and `async/await`

When this code was first developed we strongly favoured the use of traditional Promises, using the `fn().then().finally().catch()` model. As time has gone on, we recognize that in many cases, an `async`/`await` code structure may be more readable and maintainable in the long run. We welcome fixes to the code that help us implement these changes.
