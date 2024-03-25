#!/usr/bin/env node --no-warnings

import * as p from "@clack/prompts";
import {
  accessSync as access,
  appendFileSync as appendFile,
  existsSync as fileExist,
  mkdirSync as mkdir,
  writeFileSync as writeFile,
} from "fs";
import path from "path";
import color from "picocolors";
import type { Colors } from "picocolors/types.js";
import library from "./lib.json" assert { type: "json" }; //  assert { type: "json" }

p.intro(color.underline(color.yellow("raz-cli")));

type LibNames = "component" | "hook" | "icon" | "tailwind" | "vscode" | "type";

type Libraries = {
  [key in LibNames]: LibraryType[];
};

type LibraryType = {
  id: number;
  name: string;
  fileName: string;
  value: string;
  method?: Method;
  nextStep?: {
    title: string[];
    message: string[];
    color?: string;
  };
};

type ExistType = true | "ENOENT" | undefined;

/**
 * todo add Types
 */
type TypesType = LibNames;
type ActionsTypes = "list" | "add" | "init";

type Method = "append" | "write";

type OutputDirData = {
  path: string;
  exist: ExistType;
};
type OutputDirType = {
  src: OutputDirData;
  component: OutputDirData;
  icon: OutputDirData;
  hook: OutputDirData;
  tailwind: {
    config: OutputDirData;
    input: OutputDirData;
  };
  vscode: OutputDirData;
  type: OutputDirData;
};

/**
 * .../projectName/src/...
 */
const getOutDirs = (rootPath: string) => {
  return {
    src: {
      path: path.join(rootPath, "src"),
      exist: undefined,
    },
    component: { path: path.join(rootPath, "src", "components", "ui"), exist: undefined },
    icon: { path: path.join(rootPath, "src", "components", "ui", "icons"), exist: undefined },
    hook: { path: path.join(rootPath, "src", "hooks"), exist: undefined },
    tailwind: {
      config: { path: path.join(rootPath), exist: undefined },
      input: { path: path.join(rootPath, "src", "tailwind"), exist: undefined },
    },
    vscode: {
      path: path.join(rootPath, ".vscode"),
      exist: undefined,
    },
    type: {
      path: path.join(rootPath, "src", "types"),
      exist: undefined,
    },
  } as OutputDirType;
};

const projectRoot = process.cwd();
const outputDir = getOutDirs(projectRoot);

type MainParameters = {
  action: ActionsTypes;
  type: TypesType;
  name: string;
};
const userCmd = process.argv.slice(2);
const defaultForMain: MainParameters = {
  action: process.argv[2] as ActionsTypes, // add or list
  type: process.argv[3] as TypesType, // component or hook or icon or tailwind or vscode or types
  name: process.argv[4], // name string
};

const actionsList: readonly ActionsTypes[] = ["add", "list", "init"] as const;
const typesList: readonly TypesType[] = ["component", "icon", "hook", "tailwind", "vscode", "type"] as const;

const namesList: readonly { label: Capitalize<`${TypesType}s`>; names: (string | undefined)[] }[] = [
  {
    label: "Components",
    names: library.component.map((item) => item.name),
  },
  {
    label: "Hooks",
    names: (library.hook as { name?: string }[]).map((item) => ("name" in item ? item.name : "")),
  },
  {
    label: "Icons",
    names: library.icon.map((item) => item.name),
  },
  {
    label: "Tailwinds",
    names: library.tailwind.map((item) => item.name),
  },
  {
    label: "Vscodes",
    names: library.vscode.map((item) => item.name),
  },
  {
    label: "Types",
    names: library.type.map((item) => item.name),
  },
] as const;

const flags = ["-c", "-i", "-h", "-t", "-v", "-T", "-V", "--verbose", "-H", "--help"];
let userFlags = userCmd.filter((item) => flags.includes(item));
// verbose flag
const verbose = userFlags.includes("-V") || userFlags.includes("--verbose");
// help flag
const help = userFlags.includes("-H") || userFlags.includes("--help");
if (verbose || help)
  userFlags = userFlags.filter((item) => item !== "-V" && item !== "-H" && item !== "--verbose" && item !== "--help");
// last flag use to determine the type
switch (userFlags[userFlags.length - 1] || "") {
  case "-c":
    defaultForMain.type = "component";
    break;
  case "-i":
    defaultForMain.type = "icon";
    break;
  case "-h":
    defaultForMain.type = "hook";
    break;
  case "-t":
    defaultForMain.type = "tailwind";
    break;
  case "-v":
    defaultForMain.type = "vscode";
    break;
  case "-T":
    defaultForMain.type = "type";
    break;
  default:
    break;
}

function logList() {
  p.log.step(`${color.blue("actions ")}: ${actionsList.join(", ")}`);
  p.log.step(`${color.blue("types ")}: ${typesList.join(", ")}`);
  p.log.step(`${color.blue("flags ")}: ${flags.join(", ")}`);
  namesList.map((item) => p.log.step(`${color.blue(item.label)} : ${item.names.join(", ")}`));
  sayBye();
}

function logIsVerbose(param: "warn" | "success" | "info" | "error" | "step", message: string) {
  verbose && p.log[param](message);
  return true;
}

function logInfo(arr: string[] | string) {
  const isArr = Array.isArray(arr);
  if (!isArr) arr = [arr] as string[];
  p.log.info(`${(arr as string[]).join(" ")}`);
  return true;
}

function sayBye(exit = 0 as 0 | 1) {
  const { action, type: cmdType, name } = defaultForMain;
  if (exit === 0 && action && cmdType && name && action === "add") {
    library[cmdType].map((item) => {
      if (item.name !== name) return;
      if ("nextStep" in item) {
        const { nextStep } = item;
        const { title, message } = nextStep!;
        let noteColor: keyof Colors = "blue";
        if ("color" in nextStep && typeof nextStep.color === "string") noteColor = nextStep.color as keyof Colors;
        for (let i = 0; i < message.length; i++) p.note(message[i], (color as any)[noteColor](title[i]));
      }
    });
  }

  if (cmdType === "tailwind") {
    p.log.warn(
      `you should add a vscode config with ${color.blue(
        "raz add vscode config"
      )} if @rules from tailwind throw unknown in your css`
    );
  }

  done(exit);
}

function done(success: 0 | 1) {
  p.log.success(color.green("✔ ") + "Done");
  process.exit(success);
}

function writeToEndOfFile(path: string, data: string) {
  try {
    appendFile(path, "\n" + data);
    return true;
  } catch (error) {
    p.log.error(error as unknown as string);
  }
}

function handleListAction() {
  logList();
}
async function handleInitAction() {
  let testedPathsLabels = ["src", ...typesList] as const;
  for await (const label of testedPathsLabels) {
    await askToCreateFolder(label);
  }
  sayBye();
}

function basicCmdValidation(action: ActionsTypes, type: TypesType, name: string) {
  const noType = !type;
  const noAction = !action;
  const noName = !name;

  const wrongType = type && !typesList.includes(type as TypesType);
  const wrongAction = action && !actionsList.includes(action as ActionsTypes);
  const wrongName = name && !namesList.flatMap((item) => item.names).includes(name);

  if (noAction && noType && noName) {
    p.log.warn(`No arguments specified `);
    p.log.info("raz <action> <type> <name> or try raz list to see the list of available items\n");
    sayBye();
  } else if (wrongAction) {
    p.log.warn("Wrong action specified");
    p.log.info(`Actions available are ${actionsList.join(", ")}`);
    sayBye();
  } else if (wrongType) {
    p.log.warn("Wrong type specified");
    p.log.info(`Types available are ${typesList.join(", ")}`);
    sayBye();
  } else if (wrongName) {
    p.log.warn("Wrong name specified");
    p.log.info(`Please try the command raz list to see the list of available items`);
    sayBye();
  }
}

async function askToCreateFolder(type: TypesType | "src") {
  const isTailwind = type === "tailwind";
  const isOk = await p.select({
    message: `Do you want to create a ${type} folder?`,
    initialValue: true,
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  });
  const path = isTailwind ? outputDir[type].input.path : outputDir[type].path;
  isOk && createFolder(path);
  isTailwind ? (outputDir[type].input.exist = true) : (outputDir[type].exist = true);
}

async function checkFolders(type: TypesType) {
  const { src, component, hook, icon, tailwind, vscode, type: typescript } = outputDir;
  src.exist = checkFolderExists(src.path);
  component.exist = checkFolderExists(component.path);
  hook.exist = checkFolderExists(hook.path);
  icon.exist = checkFolderExists(icon.path);
  tailwind.input.exist = checkFolderExists(tailwind.input.path);
  vscode.exist = checkFolderExists(vscode.path);
  typescript.exist = checkFolderExists(typescript.path);

  if (!src.exist || src.exist === "ENOENT") {
    let testedPathsLabels = ["src", ...typesList];
    for await (const label of testedPathsLabels) {
      if (label === type) {
        await askToCreateFolder(label);
      }
    }
    sayBye();
  }

  const directories = {
    component: outputDir.component,
    hook: outputDir.hook,
    icon: outputDir.icon,
    tailwind: outputDir.tailwind.input,
    vscode: outputDir.vscode,
    type: outputDir.type,
  };

  for (const [dirType, dir] of Object.entries(directories)) {
    if ((dir.exist === "ENOENT" || !dir.exist) && type === dirType) {
      createFolder(dir.path);
      logIsVerbose("step", `Created ${dirType} folder`);
      return;
    }
  }
}

type FindInLibraryParams = {
  type: TypesType;
  name: string;
};
type FindInLibraryReturnType = {
  item: LibraryType | null;
  message: string;
};
function findInLibrary({ type: cmdType, name }: FindInLibraryParams): FindInLibraryReturnType {
  const item = library[cmdType].find((item) => item.name === name);
  return item
    ? { item, message: `Found ${name} ${cmdType} in the library` }
    : {
        item: null,
        message: `Could not find ${name} ${cmdType} in the library\n Please try command raz list to see the list of available items`,
      };
}

/*
 * Find at deep = 1 & 2 the propertie path
 */
function findPath({ type: cmdType, name }: { type: TypesType; name: string }) {
  if (cmdType in outputDir && "path" in outputDir[cmdType]) return (outputDir[cmdType] as OutputDirData).path;
  else if (name in outputDir[cmdType] && "path" in (outputDir[cmdType] as { [key: string]: OutputDirData })[name])
    return (outputDir[cmdType] as { [key: string]: OutputDirData })[name].path;
  else return false;
}

function checkFolderExists(folderPath: string) {
  try {
    access(folderPath);
    return true;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    return err.code as "ENOENT";
  }
}

function createFolder(folderPath: string) {
  try {
    mkdir(folderPath, { recursive: true });
  } catch (error) {
    console.error(error);
    p.log.error(`Could not create ${folderPath} Exiting with code 1`);
    sayBye();
  }
}

function generateIconTypes(iconWrited: string[]) {
  /** */
  const first = "export type IconNames = ";
  const body = iconWrited.map((icon, i) => {
    return `\n  ${i !== 0 ? "|" : ""} "raz-${icon.toLowerCase()}"`;
  });
  const last = ";\n";
  return first + body.join("\n") + last;
}

function generateIconIndexImports(iconWrited: string[]) {
  const iconImports = iconWrited.map((icon) => {
    return `import ${icon} from "./${icon}";\n`;
  });
  return iconImports.join("\n");
}

function generateIconIndexComponent(iconWrited: string[]) {
  const first = "const Icon = ({ name, ...rest }: IconProps) => {\n    switch (name) {\n";
  const body = iconWrited.map((icon) => {
    return `  case "raz-${icon.toLowerCase()}": return <${icon} {...rest} />;`;
  });
  const last = `\ndefault: return <></>;\n}};\nexport default Icon;\n`;
  return first + body.join("\n") + last;
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
//////////////** MAIN **////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

async function main({ action, type: cmdType, name } = defaultForMain) {
  action === "init" && !cmdType && !name && (await handleInitAction());
  action === "list" && !cmdType && !name && handleListAction();
  console.log(help);
  help && logInfo(["Flags : ", ...flags]) && sayBye();

  basicCmdValidation(action, cmdType, name);
  await checkFolders(cmdType);

  logIsVerbose("info", `Searching ${name} ${cmdType} in the library`);
  const element = findInLibrary({ type: cmdType, name });
  if (!element || !element.item) {
    logIsVerbose("error", `${element.message}`);
    sayBye();
    return;
  }
  logIsVerbose("step", "Found !");
  logIsVerbose("info", "Adding it to your project");

  const globalPath = findPath({ type: cmdType, name });
  if (!globalPath) {
    p.log.error(`Could not find path for ${name} ${cmdType}`);
    sayBye(1);
  }
  const { value, fileName } = element.item;
  const path = `${globalPath}/${fileName}`;
  const method = element.item.method ?? "write";
  try {
    /** ICON LOGIC */
    if (cmdType === "icon") {
      // => ecrire le nouvelle icon
      method === "append" ? writeToEndOfFile(path, value) : writeFile(path, value);
      // => lire le nom des icones deja ecrites
      const iconWrited = library.icon
        .map((item) => {
          return fileExist(`${globalPath}/${item.fileName}`) ? item.name : "";
        })
        .filter((icon) => icon !== "" && icon !== "Icon");
      const indexComponent = library.icon.find((item) => item.name === "Icon")?.value;
      if (iconWrited.length > 0 && name !== "Icon") {
        writeFile(
          `${globalPath}/Icon.tsx`,
          "/**\n * This file is generated\n **/" +
            generateIconIndexImports(iconWrited) +
            indexComponent +
            generateIconTypes(iconWrited) +
            generateIconIndexComponent(iconWrited)
        );
      }
    } else {
      method === "append" ? writeToEndOfFile(path, value) : writeFile(path, value);
    }
    logIsVerbose("success", `Successfully added`);
  } catch (error) {
    const msg = color.bgRed(`Could not add ${name} ${cmdType} to your project`);
    logIsVerbose("error", msg);
    logIsVerbose("info", `Please try command raz list to see the list of available items`);
  }

  sayBye();
}

main();
