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

### Clone Your Active Repos To A Directory

1. `mkdir your-directory && cd your-directory`

2. Run `active-git <github username>` inside the folder to get clones of your most relevant git repos.

### Use A Config File

1. `mkdir your-directory && cd your-directory`

2. Create a config.yml with content that looks like this: 
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

2. Run `active-git` inside the folder to get clones of your most relevant git repos.

### Run As A Service (Mac only...for now)

1. `cd your-directory`

2. `active-git init-service`

## License
MIT

## Contributing
Please submit an issue [Here](https://github.com/benjaminbwright/active-git), and leave note whether or not you would be interested in helping to fix the bug or add the feature.

## Questions
Please email me at benjamin@famousstick.com if you have any questions about this package.