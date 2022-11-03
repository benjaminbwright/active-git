// DEPENDENCIES
import axios from "axios"
import { execSync } from "child_process"
import { 
  readFileSync, 
  writeFileSync,
  readdirSync,
  rmSync,
  existsSync
} from "fs"
import YAML from 'yaml'


// FUNCTIONS
/**
 * Gets all the repositories for a user
 * @param {string} user github username
 */
export const getRepos = async (user, configData) => {
  // let { data: user } = await axios.get(`https://api.github.com/users/${user}/repos?per_page=1001`)
  let { data: repos } = await axios.get(`https://api.github.com/users/${user}/repos?per_page=1001`)
  // console.log(repos)
  if (!configData.forks) {
    repos = notForks(repos);
  }
  const watched = minWatchersOnly(repos, configData.minWatchers);
  // don't include forks
  const starred = minStarsOnly(repos, configData.minStars)
  // only include repose with active issues
  const withIssues = openIssues(repos);
  let combinedRepos = [
    ...new Set([
      ...starred,
      ...watched,
      ...withIssues
    ])
  ]
  

  cloneRepos(combinedRepos,  getLocalDirectories("./"), configData)
}

/**
 * Returns a list of github repos that have been starred
 * @param {Array} repos a list of repos
 * @returns {Array} repos with a stargazers
 */
export const minStarsOnly = (repos, minStars) => repos.filter(({ stargazers_count }) => stargazers_count >= minStars)

/**
 * Returns a list of github repos that have been watched
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
export const minWatchersOnly = (repos, minWatchers) => repos.filter(({ watchers_count }) => watchers_count >= minWatchers)

/**
 * Returns a list of github repos with open issues
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
export const openIssues = repos => repos.filter(({ open_issues }) => open_issues > 0)

/**
 * Returns a list of github repos with a topic of "active"
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
export const activeOnly = repos => repos.filter(({ topics }) => topics.includes("active"))

/**
 * Returns a list of github repos that have not been forked
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
export const notForks = repos => repos.filter(({fork}) => !fork )

/**
 * Clones a list of github repos
 * @param {Array} repos 
 */
export const cloneRepos = (repos, directories, { excludedRepos }) => {

  const repoNames = repos.map(({ name }) => name)

  // remove repos that are not included in the repo list
  for (const directory of directories) {
    if (!repoNames.includes(directory) && !excludedRepos.includes(directory)) {
      console.log(`Removing ${directory}`)
      rmSync(directory, { recursive: true, force: true })
    }
  }

  // clone repos from the repo list
  for (const repo of repos) {
    // only clone a repo if it's not already cloned and not on the excluded list
    if (!directories.includes(repo.name) && !excludedRepos.includes(repo.name)) {
      execSync(`git clone ${repo.ssh_url}`, { stdio: "inherit"});
    }
  }

  updateConfig(configData);
}

export const getLocalDirectories = source => readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

export const updateConfig = (config) => writeFileSync("config.yml", YAML.stringify(config), "utf8")

export const getConfig = () => {

  if (existsSync("config.yml")) {
    return YAML.parse(readFileSync("config.yml", "utf8"))
  }

  return {
    username: process.argv[2],  
    stars: 1,
    watchers: 1,
    topics: [
      "active"
    ],
    forks: false,
    excludedRepos: []
  };
  
};

// Data
export const configData = getConfig();
