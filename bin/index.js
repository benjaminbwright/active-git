#!/usr/bin/env node
import {
  getConfig,
  getRepos,
  configData
} from "../lib/repos.js"
import {
  initService
} from "../lib/initService.js"

console.log(process.platform)
console.log(process.argv)
// console.log(process.env)

const args = process.argv.slice(2);

switch (args[0]) {
  case "init":
  case "init-config":
    console.log("Running init script");
    break;
  case "init-service":
    console.log("Setting up service");
    initService();
    break;
  default: 
    console.log("Active git running.")
    getRepos(configData.username, configData);
    break;
}