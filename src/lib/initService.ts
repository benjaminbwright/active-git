import { writeFileSync } from "fs";
import { execSync } from "child_process"
import path from "path";
import os from "os";

const user: any = process.env.USER

export const generateLaunchAgent = (serviceName: string) => {
  const plistContents: string = `<?xml version="1.0" encoding="UTF-8"?>
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
  const plistPath = getPlistPath(serviceName);  
  writeFileSync(plistPath, plistContents, "utf8")
  console.log(`Launch agent created at ${plistPath}`);
}

export const removeLaunchAgent = (serviceName: string) => {
  const plistPath = getPlistPath(serviceName);
  execSync(`rm ${plistPath}`, { stdio: "inherit"})
}

export const getPlistPath = (serviceName: string) => path.join("/Users", user, "Library", "LaunchAgents", serviceName + ".plist")

export const launchService = (serviceName: string) => {
  const plistPath = getPlistPath(serviceName);
  execSync(`launchctl bootstrap gui/${os.userInfo().uid} ${plistPath}`, { stdio: "inherit"});
  execSync(`launchctl kickstart -k gui/${os.userInfo().uid}/${serviceName}`, { stdio: "inherit"});
};

export const killService = (serviceName: string) => {
  const plistPath = getPlistPath(serviceName);
  execSync(`launchctl bootout gui/${os.userInfo().uid} ${plistPath}`, { stdio: "inherit"});
  removeLaunchAgent(serviceName)
}

export const initService = () => {
  const serviceName = "com.active-git";
  const plistPath = getPlistPath(serviceName);
  generateLaunchAgent(serviceName);
  launchService(serviceName);
}

export const removeService = () => {
  const serviceName = "com.active-git";
  killService(serviceName);
}