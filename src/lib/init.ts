import {
  copyFileSync
} from "fs"
import {
  join
} from "path"

export const initConfig = () => {
  copyFileSync(join(__dirname, "..", "..", "config.yml.example"), "config.yml")
}

