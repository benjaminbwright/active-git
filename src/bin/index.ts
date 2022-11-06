#!/usr/bin/env node
import {
  getRepos,
  filterRepos,
  cloneRepos,
  configData,
  getLocalDirectories
} from "../lib/repos.js"
import {
  initService,
  removeService
} from "../lib/initService.js"

// console.log(process.platform)
// console.log(process.argv)
// console.log(process.env)

const args = process.argv.slice(2);

switch (args[0]) {
  case "init":
  case "init-config":
    console.log("Running init script");
    break;
  case "start-service":
  case "init-service":
    console.log("Setting up service");
    initService();
    break;
  case "remove-service":
  case "stop-service":
    console.log("Removing active-git service");
    removeService();
  default: 
    console.log("Active git running.")
    let repos: any = getRepos(configData.username);
    repos = filterRepos(repos, configData);
    cloneRepos(repos,  getLocalDirectories("./"), configData)
    break;
}