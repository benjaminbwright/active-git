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
export const getRepos = async (user: string, page: number = 1): Promise<Array<any>> => {
  let { data: repos } = await axios.get(`https://api.github.com/users/${user}/repos?page=${page}&per_page=100&type=all`)
  if (repos.length === 100) {
    const pageNumber = page + 1;
    const moreRepos = await getRepos(user, pageNumber);
    repos = [...repos, ...moreRepos];
  }
  
  return repos || new Array([]);
}

export const filterRepos = (repos: Array<any>, configData: any) => {
  if (!configData.forks) {
    repos = notForks(repos);
  }
  // repos with a minimum number of watchers
  const watched: any = minWatchersOnly(repos, configData.minWatchers)
  // don't include forks
  const starred: any = minStarsOnly(repos, configData.minStars)
  // only include repose with active issues
  const withIssues: any = openIssues(repos)
  
  // all the filtered repos combined without dupes
  let filteredRepos = Array.from(
    new Set<any>([
      ...starred,
      ...watched,
      ...withIssues
    ])
  )

  return filteredRepos;
}
/**
 * Returns a list of github repos that have been starred
 * @param {Array} repos a list of repos
 * @returns {Array} repos with a stargazers
 */ 
export const minStarsOnly = (repos: any, minStars: number) => repos.filter(({ stargazers_count }: { stargazers_count: number }) => stargazers_count >= minStars)

/**
 * Returns a list of github repos that have been watched
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
export const minWatchersOnly = (repos: any, minWatchers: number) => repos.filter(({ watchers_count }: { watchers_count: Number}) => watchers_count >= minWatchers)

/**
 * Returns a list of github repos with open issues
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
export const openIssues = (repos: any) => repos.filter(({ open_issues }: { open_issues: number }) => open_issues > 0)

/**
 * Returns a list of github repos with a topic of "active"
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
export const activeOnly = (repos: any): Array<any> => repos.filter(({ topics } : { topics: Array<string> }) => topics.includes("active"))

/**
 * Returns a list of github repos that have not been forked
 * @param {Array} repos a list of repos
 * @returns {Array}
 */
export const notForks = (repos: any): Array<any> => repos.filter(({fork} : {fork: boolean}) => !fork )

/**
 * Clones a list of github repos
 * @param {Array} repos 
 */
export const cloneRepos = (repos: Array<any>, directories: Array<string>, { ssh, excludedRepos }: {ssh: boolean, excludedRepos: Array<any>}) => {
  console.log("repos", repos)
  const repoNames = repos.map(({ name }) => name)

  // remove repos that are not included in the repo list
  for (const directory of directories) {
    if (!repoNames.includes(directory) && !excludedRepos.includes(directory)) {
      if (!hasUntrackedChanges(directory)) {        
        console.log(`Removing ${directory}`)
        rmSync(directory, { recursive: true, force: true })
      }
    }
  }

  // clone repos from the repo list
  for (const repo of repos) {
    const url = ssh ? repo.ssh_url : repo.clone_url
    // only clone a repo if it's not already cloned and not on the excluded list
    if (!directories.includes(repo.name) && !excludedRepos.includes(repo.name)) {
      execSync(`git clone ${url}`, { stdio: "inherit"});
    }
  }

  updateConfig(configData);
}

export const hasUntrackedChanges = (directory: string) => {
  try {
    const gitStatus = execSync(`git --git-dir=./${directory}/.git --work-tree=./${directory} status
    `).toString();
    return !gitStatus.includes("nothing to commit, working tree clean")
  } catch (err: any) {
    console.log(err.message)
  }
}

export const getLocalDirectories = (source: string) => readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

export const updateConfig = (config: any) => writeFileSync("config.yml", YAML.stringify(config), "utf8")

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
