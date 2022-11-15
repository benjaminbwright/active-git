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
import {
  initConfig
} from "../lib/init"

const runCLI = async () => {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case "init":
    case "init-config":
      console.log("Running init script");
      initConfig();
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
      let repos: any = await getRepos(configData.username);
      repos = filterRepos(repos, configData);
      console.log(repos)
      const localDirectories = getLocalDirectories("./")
      cloneRepos(repos,  localDirectories, configData)
      break;
  }
}

runCLI();