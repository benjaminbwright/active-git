# Active Git

## Description
Keep a folder on your machine with only your most relevant git repositories.

## Table of Contents 

* [Installation](#installation)

* [Usage](#usage)

* [License](#license)

* [Contributing](#contributing)

* [Questions](#questions)

## Features
- Currently, there is only support for repositoris from GitHub
- Include repos based on:
  - Open issues
  - Number of watchers
  - Number of stars
  - Whether or not the repo is a fork

## Installation

```bash
npm install -g active-git
```
## Usage

### Run it with just your github username

```bash
mkdir your-directory && cd your-directory
```
and then...
```
active-git <github username>
```
Your repos will be cloned to your folder along with a config.yml defining the default configs.

### Use A Config File
To change which repos are included by active-git just modify the defaults in the config.yml. It should look something like this: 
```yaml
# github username
username: <username>
# minimum number of stars a repo needs to be included
minStars: 1
# minimum number of watchers a repo needs to be included
minWatchers: 1
# topics a repo needs to be included
topics:
  - <topic>
# whether or not to allow forked repos to be cloned
forks: false
# which repos do you want to exclude from updates
excludedRepos:
  - <repo name>
```

After saving changes to the config, run

```bash
active-git
```

### Run As A Service (Mac only...for now)

```bash
active-git init-service
```
### Uninstall the service
```bash
active-git remove-service
```

## License
MIT

## Contributing
Please submit an issue [Here](https://github.com/benjaminbwright/active-git) if you find a bug or would like to request a feature. Otherwise, fork the repo and send in pull requests if you would like to contribute.

## Questions
Please email me at benjamin@famousstick.com if you have any questions about this package.