#!/usr/bin/env node --no-warnings
import * as p from "@clack/prompts";
import { accessSync as access, appendFileSync as appendFile, mkdirSync as mkdir, writeFileSync as writeFile } from "fs";
import path from "path";
import color from "picocolors";
import library from "./lib.json" assert { type: "json" };
p.intro(color.underline(color.yellow("raz-cli")));
library;
/**
 * .../projectName/src/...
 */
const getOutDirs = (rootPath) => {
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
            input: { path: path.join(rootPath, "tw"), exist: undefined },
        },
        vscode: {
            path: path.join(rootPath, ".vscode"),
            exist: undefined,
        },
        types: {
            path: path.join(rootPath, "src", "types"),
            exist: undefined,
        },
    };
};
const projectRoot = process.cwd();
const outputDir = getOutDirs(projectRoot);
const userCmd = process.argv.slice(2);
const defaultForMain = {
    action: process.argv[2],
    type: process.argv[3],
    name: process.argv[4], // name string
};
const actionsList = ["add", "list"];
const typesList = ["component", "icon", "hook", "tailwind", "vscode", "types"];
const flags = ["-c", "-i", "-h", "-t", "-v", "-V", "--verbose", "-H", "--help"];
let userFlags = userCmd.filter((item) => flags.includes(item));
// verbose flag
const verbose = userFlags.includes("-V") || userFlags.includes("--verbose");
const help = userFlags.includes("-H") || userFlags.includes("--help");
if (verbose)
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
    default:
        break;
}
const namesList = [
    {
        label: "Components",
        names: library.component.map((item) => item.name),
    },
    {
        label: "Hooks",
        names: library.hook.map((item) => item.name),
    },
    {
        label: "Icons",
        names: library.icon.map((item) => item.name),
    },
    {
        label: "Tailwind",
        names: library.tailwind.map((item) => item.name),
    },
    {
        label: "Vscode",
        names: library.vscode.map((item) => item.name),
    },
];
function logList() {
    p.log.step(`${color.blue("actions ")}: ${actionsList.join(", ")}`);
    p.log.step(`${color.blue("types ")}: ${typesList.join(", ")}`);
    p.log.step(`${color.blue("flags ")}: ${flags.join(", ")}`);
    namesList.map((item) => p.log.step(`${color.blue(item.label)} : ${item.names.join(", ")}`));
    sayBye();
}
function logIsVerbose(param, message) {
    verbose && p.log[param](message);
    return true;
}
function logInfo(arr) {
    const isArr = Array.isArray(arr);
    if (!isArr)
        arr = [arr];
    p.log.info(`${arr.join(" ")}`);
    return true;
}
function sayBye(exit = 0) {
    const { action, type, name } = defaultForMain;
    if (exit === 0 && action && type && name && action === "add") {
        library[type].map((item) => {
            if (item.name !== name)
                return;
            if ("nextStep" in item) {
                const { nextStep } = item;
                const { title, message } = nextStep;
                let noteColor = "blue";
                if ("color" in nextStep && typeof nextStep.color === "string")
                    noteColor = nextStep.color;
                for (let i = 0; i < message.length; i++)
                    p.note(message[i], color[noteColor](title[i]));
            }
        });
    }
    done(exit);
}
function done(success) {
    p.log.success(color.green("✔ ") + "Done");
    process.exit(success);
}
function writeToEndOfFile(path, data) {
    try {
        appendFile(path, "\n" + data);
        return true;
    }
    catch (error) {
        p.log.error(error);
    }
}
function basicCmdValidation(action, type, name) {
    action === "list" && !type && !name && logList();
    help && logInfo(["Flags : ", ...flags]) && sayBye();
    const noType = !type;
    const noAction = !action;
    const noName = !name;
    const wrongType = type && !typesList.includes(type);
    const wrongAction = action && !actionsList.includes(action);
    const wrongName = name && !namesList.flatMap((item) => item.names).includes(name);
    if (noAction && noType && noName) {
        p.log.warn(`No arguments specified `);
        p.log.info("raz <action> <type> <name> or try raz list to see the list of available items\n");
        sayBye();
    }
    else if (wrongAction) {
        p.log.warn("Wrong action specified");
        p.log.info(`Actions available are ${actionsList.join(", ")}`);
        sayBye();
    }
    else if (wrongType) {
        p.log.warn("Wrong type specified");
        p.log.info(`Types available are ${typesList.join(", ")}`);
        sayBye();
    }
    else if (wrongName) {
        p.log.warn("Wrong name specified");
        p.log.info(`Please try the command raz list to see the list of available items`);
        sayBye();
    }
}
async function askToCreateFolder(type) {
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
async function checkFolders(type) {
    const { src, component, hook, icon, tailwind, vscode } = outputDir;
    src.exist = checkFolderExists(src.path);
    component.exist = checkFolderExists(component.path);
    hook.exist = checkFolderExists(hook.path);
    icon.exist = checkFolderExists(icon.path);
    tailwind.input.exist = checkFolderExists(tailwind.input.path);
    vscode.exist = checkFolderExists(vscode.path);
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
    };
    for (const [dirType, dir] of Object.entries(directories)) {
        if ((dir.exist === "ENOENT" || !dir.exist) && type === dirType) {
            createFolder(dir.path);
            logIsVerbose("step", `Created ${dirType} folder`);
            return;
        }
    }
}
function findInLibrary({ type, name }) {
    const item = library[type].find((item) => item.name === name);
    return item
        ? { item, message: `Found ${name} ${type} in the library` }
        : {
            item: null,
            message: `Could not find ${name} ${type} in the library\n Please try command raz list to see the list of available items`,
        };
}
/*
 * Find at deep = 1 & 2 the propertie path
 */
function findPath({ type, name }) {
    if (type in outputDir && "path" in outputDir[type])
        return outputDir[type].path;
    else if (name in outputDir[type] && "path" in outputDir[type][name])
        return outputDir[type][name].path;
    else
        return false;
}
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
//////////////**MAIN**//////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
async function main({ action, type, name } = defaultForMain) {
    basicCmdValidation(action, type, name);
    await checkFolders(type);
    switch (action) {
        case "add": {
            logIsVerbose("info", `Searching ${name} ${type} in the library`);
            const element = findInLibrary({ type, name });
            if (!element || !element.item) {
                logIsVerbose("error", `${element.message}`);
                sayBye();
                break;
            }
            logIsVerbose("step", "Found !");
            logIsVerbose("info", "Adding it to your project");
            const globalPath = findPath({ type, name });
            if (!globalPath) {
                p.log.error(`Could not find path for ${name} ${type}`);
                sayBye(1);
            }
            const { value, fileName } = element.item;
            const path = `${globalPath}/${fileName}`;
            const method = element.item.method ?? "write";
            try {
                method === "append" ? writeToEndOfFile(path, value) : writeFile(path, value);
                logIsVerbose("success", `Successfully added`);
            }
            catch (error) {
                const msg = color.bgRed(`Could not add ${name} ${type} to your project`);
                logIsVerbose("error", msg);
                logIsVerbose("info", `Please try command raz list to see the list of available items`);
            }
            break;
        }
        case "list": {
            logList();
            break;
        }
    }
    sayBye();
}
function checkFolderExists(folderPath) {
    try {
        access(folderPath);
        return true;
    }
    catch (error) {
        const err = error;
        return err.code;
    }
}
function createFolder(folderPath) {
    try {
        mkdir(folderPath, { recursive: true });
    }
    catch (error) {
        console.error(error);
        p.log.error(`Could not create ${folderPath} Exiting with code 1`);
        sayBye();
    }
}
main();
