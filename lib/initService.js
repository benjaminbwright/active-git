import { writeFileSync } from "fs";
import { execSync } from "child_process"
import path from "path";
import os from "os";

export const generateLaunchAgent = () => {
  const serviceName = "com.active-git"
  const plistContents = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${serviceName}</string>
    <key>WorkingDirectory</key>
    <string>${process.env.PWD}</string>
    <key>ProgramArguments</key>
    <array>
      <string>${process.argv[0]}</string>
      <string>${process.argv[1]}</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Minute</key>
        <integer>05</integer>
    </dict>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
` 

  const plistPath = path.join("/Users", process.env.USER, "Library", "LaunchAgents", serviceName + ".plist")
  writeFileSync(plistPath, plistContents, "utf8")

  execSync(`launchctl bootstrap gui/${os.userInfo().uid} ${plistPath}`, { stdio: "inherit"});
  execSync(`launchctl kickstart -k gui/${os.userInfo().uid}/${serviceName}`, { stdio: "inherit"});
}

export const initService = () => {
  generateLaunchAgent();
}