#!/usr/bin/env node

// Dependencies
import axios from "axios"
import { execSync } from "child_process"
import { 
  readFileSync, 
  writeFileSync,
  readdirSync,
  rmSync
} from "fs"
import YAML from 'yaml'

// Functions
const getConfig = () => YAML.parse(readFileSync("config.yml", "utf8"));

/**
 * Gets all the repositories for a user
 * @param {string} user github username
 */
const getRepos = async (user, configData) => {
  // let { data: user } = await axios.get(`https://api.github.com/users/${user}/repos?per_page=1001`)
  let { data: repos } = await axios.get(`https://api.github.com/users/${user}/repos?per_page=1001`)
  console.log(repos)
  repos = notForks(repos);
  const watched = watchedOnly(repos);
  // don't include forks
  const starred = starsOnly(repos)
  // only include repose with active issues
  const withIssues = openIssues(repos);
  const combinedRepos = [
    ...new Set([
      ...starred,
      ...watched,
      ...withIssues
    ])
  ]

  console.log(combinedRepos)
  console.log(combinedRepos.length)
  console.log(combinedRepos.map(({ name, watchers_count, stargazers_count, fork, open_issues }) => ({
    name,
    watchers_count,
    stargazers_count,
    fork,
    open_issues
  })));

  cloneRepos(combinedRepos,  getLocalDirectories("./"), configData)
}

/**
 * Returns a list of github repos that have been starred
 * @param {Array} repos a list of repos
 * @returns {Array} repos with a stargazers
 */
const starsOnly = repos => repos.filter(({ stargazers_count }) => stargazers_count > 0)

/**
 * Returns a list of github repos that have been watched
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
const watchedOnly = repos => repos.filter(({ watchers_count }) => watchers_count > 0)

/**
 * Returns a list of github repos with open issues
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
const openIssues = repos => repos.filter(({ open_issues }) => open_issues > 0)

/**
 * Returns a list of github repos with a topic of "active"
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
const activeOnly = repos => repos.filter(({ topics }) => topics.includes("active"))

/**
 * Returns a list of github repos that have not been forked
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
const notForks = repos => repos.filter(({fork}) => !fork )

/**
 * Clones a list of github repos
 * @param {Array} repos 
 */
const cloneRepos = (repos, directories, { excludedRepos }) => {

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

  configData.clonedRepos = repoNames
  updateConfig(configData);
}

const getLocalDirectories = source => readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const combineRepos = (options) => {}

const updateConfig = (config) => writeFileSync("config.yml", YAML.stringify(config), "utf8")


const configData = getConfig() || {
  username: process.argv[2], 
  stars: 1,
  watchers: 1,
  topics: [
    "active"
  ],
  forks: false,
  excludedRepos: []
}
console.log("Active git running.")
getRepos(configData.username, configData);