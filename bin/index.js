#!/usr/bin/env node --no-warnings
import * as p from "@clack/prompts";
import { accessSync as access, appendFileSync as appendFile, existsSync as fileExist, mkdirSync as mkdir, writeFileSync as writeFile, } from "fs";
import path from "path";
import color from "picocolors";
import library from "./lib.json" assert { type: "json" };
p.intro(color.underline(color.yellow("raz-cli")));
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
    };
};
const projectRoot = process.cwd();
const outputDir = getOutDirs(projectRoot);
const userCmd = process.argv.slice(2);
const defaultForMain = {
    action: process.argv[2],
    type: process.argv[3],
    name: process.argv[4],
};
const actionsList = ["add", "list", "init"];
const typesList = ["component", "icon", "hook", "tailwind", "vscode", "type"];
const namesList = [
    {
        label: "Components",
        names: library.component.map((item) => item.name),
    },
    {
        label: "Hooks",
        names: library.hook.map((item) => ("name" in item ? item.name : "")),
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
];
const flags = ["-c", "-i", "-h", "-t", "-v", "-T", "-V", "--verbose", "-H", "--help"];
let userFlags = userCmd.filter((item) => flags.includes(item));
const verbose = userFlags.includes("-V") || userFlags.includes("--verbose");
const help = userFlags.includes("-H") || userFlags.includes("--help");
if (verbose || help)
    userFlags = userFlags.filter((item) => item !== "-V" && item !== "-H" && item !== "--verbose" && item !== "--help");
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
    const { action, type: cmdType, name } = defaultForMain;
    if (exit === 0 && action && cmdType && name && action === "add") {
        library[cmdType].map((item) => {
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
    if (cmdType === "tailwind") {
        p.log.warn(`you should add a vscode config with ${color.blue("raz add vscode config")} if @rules from tailwind throw unknown in your css`);
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
function handleListAction() {
    logList();
}
async function handleInitAction() {
    let testedPathsLabels = ["src", ...typesList];
    for await (const label of testedPathsLabels) {
        await askToCreateFolder(label);
    }
    sayBye();
}
function basicCmdValidation(action, type, name) {
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
function findInLibrary({ type: cmdType, name }) {
    const item = library[cmdType].find((item) => item.name === name);
    return item
        ? { item, message: `Found ${name} ${cmdType} in the library` }
        : {
            item: null,
            message: `Could not find ${name} ${cmdType} in the library\n Please try command raz list to see the list of available items`,
        };
}
function findPath({ type: cmdType, name }) {
    if (cmdType in outputDir && "path" in outputDir[cmdType])
        return outputDir[cmdType].path;
    else if (name in outputDir[cmdType] && "path" in outputDir[cmdType][name])
        return outputDir[cmdType][name].path;
    else
        return false;
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
function generateIconTypes(iconWrited) {
    const first = "export type IconNames = ";
    const body = iconWrited.map((icon, i) => {
        return `\n  ${i !== 0 ? "|" : ""} "raz-${icon.toLowerCase()}"`;
    });
    const last = ";\n";
    return first + body.join("\n") + last;
}
function generateIconIndexImports(iconWrited) {
    const iconImports = iconWrited.map((icon) => {
        return `import ${icon} from "./${icon}";\n`;
    });
    return iconImports.join("\n");
}
function generateIconIndexComponent(iconWrited) {
    const first = "const Icon = ({ name, ...rest }: IconProps) => {\n    switch (name) {\n";
    const body = iconWrited.map((icon) => {
        return `  case "raz-${icon.toLowerCase()}": return <${icon} {...rest} />;`;
    });
    const last = `\ndefault: return <></>;\n}};\nexport default Icon;\n`;
    return first + body.join("\n") + last;
}
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
        if (cmdType === "icon") {
            method === "append" ? writeToEndOfFile(path, value) : writeFile(path, value);
            const iconWrited = library.icon
                .map((item) => {
                return fileExist(`${globalPath}/${item.fileName}`) ? item.name : "";
            })
                .filter((icon) => icon !== "" && icon !== "Icon");
            const indexComponent = library.icon.find((item) => item.name === "Icon")?.value;
            if (iconWrited.length > 0 && name !== "Icon") {
                writeFile(`${globalPath}/Icon.tsx`, "/**\n * This file is generated\n **/" +
                    generateIconIndexImports(iconWrited) +
                    indexComponent +
                    generateIconTypes(iconWrited) +
                    generateIconIndexComponent(iconWrited));
            }
        }
        else {
            method === "append" ? writeToEndOfFile(path, value) : writeFile(path, value);
        }
        logIsVerbose("success", `Successfully added`);
    }
    catch (error) {
        const msg = color.bgRed(`Could not add ${name} ${cmdType} to your project`);
        logIsVerbose("error", msg);
        logIsVerbose("info", `Please try command raz list to see the list of available items`);
    }
    sayBye();
}
main();
