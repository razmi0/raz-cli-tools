#!/usr/bin/env node
import * as p from "@clack/prompts";
import { accessSync as access, appendFileSync as appendFile, mkdirSync as mkdir, writeFileSync as writeFile } from "fs";
import path from "path";
import color from "picocolors";
import data from "./data.json" assert { type: "json" };
console.log(data);
p.intro("raz-cli");
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
const generateLibrary = (outputDir) => {
    return {
        component: [
            {
                name: "Hello",
                fileName: "Hello",
                path: path.join(outputDir.component.path, "Hello.tsx"),
                value: "\n\nconst Hello = () => {\n\treturn <div>Hello World</div>;\n};\n\nexport default Hello;\n",
            },
            {
                name: "World",
                fileName: "World",
                path: path.join(outputDir.component.path, "Hello.tsx"),
                value: "\n\nconst World = () => {\n\treturn <div>World Hello</div>;\n};\n\nexport default World;\n",
            },
            {
                name: "Button",
                fileName: "Button",
                path: path.join(outputDir.component.path, "Button.tsx"),
                value: 'import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";\nimport { useRef, useState } from "react";\n\ntype ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {\n  children: ReactNode;\n  onClick?: () => void | ((e: MouseEvent<HTMLButtonElement>) => void) | ((e: MouseEvent) => void);\n  ariaLabel: string;\n  loading?: boolean;\n  loader?: ReactNode;\n  disabled?: boolean;\n  className?: string;\n  disabledIfLoading?: boolean;\n  variant?: "primary" | "invisible";\n};\n\nconst variantClasses = {\n  primary:\n    "relative flex gap-2 py-1 px-3 whitespace-nowrap rounded-md text-sm border-black/30 border-[1px] font-medium transition-colors ease-out shadow-inner-shadow-dark-sm bg-def-300 hover:bg-def-400 ",\n  invisible: "h-fit w-fit p-0 m-0 border-0 bg-transparent text-transparent hover:text-transparent hover:bg-transparent",\n};\n\nconst Button = ({\n  children,\n  onClick,\n  loader = <></>,\n  loading = false,\n  disabled = false,\n  disabledIfLoading = true,\n  ariaLabel,\n  className = "",\n  variant = "primary",\n  type = "button",\n  ...rest\n}: ButtonProps) => {\n  const [waves, setWaves] = useState<ReactNode[]>([]);\n  const btnRef = useRef<HTMLButtonElement>(null);\n\n  const clickHandler = (e: MouseEvent<HTMLButtonElement>) => {\n    onClick && onClick(e);\n    if (!btnRef.current) return;\n    setWaves((waves) => [...waves, <Wave width={btnRef.current?.offsetWidth} height={btnRef.current?.offsetHeight} />]);\n    setTimeout(() => {\n      setWaves((waves) => waves.slice(1));\n    }, 2100);\n  };\n\n  const disabledClasses =\n    disabledIfLoading && loading\n      ? "cursor-wait text-def-300 bg-transparent hover:bg-transparent"\n      : disabled\n      ? "cursor-not-allowed"\n      : "cursor-pointer";\n\n  return (\n    <button\n      {...rest}\n      onClick={clickHandler}\n      type={type}\n      aria-label={ariaLabel}\n      disabled={disabled}\n      aria-disabled={disabled}\n      className={`${disabledClasses} ${variantClasses[variant]} ${className}`}\n      ref={btnRef}\n    >\n      {children}\n      {loading && loader}\n      {variant !== "invisible" &&\n        waves.map((wave, i) => (\n          <div key={i} className="absolute left-0 top-0">\n            {wave}\n          </div>\n        ))}\n    </button>\n  );\n};\n\ntype WaveProps = {\n  height?: number;\n  width?: number;\n};\n\nconst Wave = ({ width, height }: WaveProps) => {\n  const [active, setActive] = useState(false);\n  setTimeout(() => setActive(true), 10);\n  return (\n    <div\n      className={`button-wave wave-motion-appear wave-motion rounded-md ${active ? "wave-motion-appear-active" : ""}`}\n      style={{ left: "-1px", top: "-1px", width: width || 0 + "px", height: height || 0 + "px" }}\n    />\n  );\n};\n\nexport default Button;\n',
            },
        ],
        hook: [
            {
                name: "useHello",
                fileName: "useHello",
                path: path.join(outputDir.hook.path, "useHello.ts"),
                value: '\n\nconst useHello = () => {\n\tconsole.log("Hello from useHello");\n};\n\nexport default useHello;\n',
            },
        ],
        icon: [
            {
                name: "init",
                fileName: "index",
                path: path.join(outputDir.icon.path, "HelloIcon.tsx"),
                method: "append",
                value: "/**\n * Add your icon here\n**/",
            },
        ],
        tailwind: [
            {
                name: "config",
                fileName: "tailwind.config.js",
                path: path.join(outputDir.tailwind.config.path, "tailwind.config.js"),
                value: '/** @type {import(\'tailwindcss\').Config} */\nexport default {\n  content: ["./src/components/*.tsx", "./src/*.tsx", "./src/components/ui/*.tsx"],\n  theme: {\n    extend: {\n      colors: {\n        def: {\n          500: "#242424FF",\n          400: "#343434FF",\n          300: "#5F5F5FFF",\n          200: "#AEAEAEFF",\n          100: "#EBEBEBFF",\n        },\n        darkblue: {\n          500: "#1C1E24FF",\n          450: "#2B2F38FF",\n          400: "#282C34FF",\n          300: "#3A4254FF",\n          200: "#495778FF",\n          100: "#54669D",\n          50: "#7A85BB",\n        },\n\n        card: {\n          500: "rgb(58 66 84 / 0.95)",\n        },\n      },\n\n      fontSize: {\n        "2xl": "1.5rem",\n      },\n      keyframes: {\n        "accordion-down": {\n          from: { height: "0" },\n          to: { height: "var(--radix-accordion-content-height)" },\n        },\n        "accordion-up": {\n          from: { height: "var(--radix-accordion-content-height)" },\n          to: { height: "0" },\n        },\n      },\n      animation: {\n        "accordion-down": "accordion-down 0.1s ease-out",\n        "accordion-up": "accordion-up 0.1s ease-out",\n      },\n    },\n  },\n  plugins: [\n    ({ addVariant }) => {\n      addVariant("child", "& > *");\n      addVariant("child-hover", "& > *:hover");\n    },\n    ({ addVariant, e, postcss }) => {\n      addVariant("hover", ({ container, separator }) => {\n        const hoverRule = postcss.atRule({ name: "media", params: "(hover: hover)" });\n        hoverRule.append(container.nodes);\n        container.append(hoverRule);\n        hoverRule.walkRules((rule) => {\n          rule.selector = `.${e(`hover${separator}${rule.selector.slice(1)}`)}:hover`;\n        });\n      });\n    },\n    ({ addBase, theme }) => {\n      function extractColorVars(colorObj, colorGroup = "") {\n        return Object.keys(colorObj).reduce((vars, colorKey) => {\n          const value = colorObj[colorKey];\n\n          const newVars =\n            typeof value === "string"\n              ? { [`--color${colorGroup}-${colorKey}`]: value }\n              : extractColorVars(value, `-${colorKey}`);\n\n          return { ...vars, ...newVars };\n        }, {});\n      }\n\n      addBase({\n        ":root": extractColorVars(theme("colors")),\n      });\n    },\n  ],\n};\n',
                nextStep: {
                    title: ["Add this script to your package.json", "Tailwind next steps"],
                    message: [
                        '"scripts": {\n"tw:build": "npx tailwindcss -i ./tw/input.css -o ./tw/output.css",\n"tw:watch": "npx tailwindcss -i ./tw/input.css -o ./tw/output.css --watch"}',
                        "1. raz add tailwind input\n2. npm run tw:build OR npm run tw:watch",
                    ],
                    color: "blue",
                },
            },
            {
                name: "input",
                fileName: "input.css",
                path: path.join(outputDir.tailwind.input.path, "input.css"),
                value: '@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap");\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root {\n  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  font-weight: 400;\n\n  color-scheme: light dark;\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-text-size-adjust: 100%;\n  scroll-behavior: smooth;\n\n  -webkit-tap-highlight-color: transparent;\n\n  --body-radial-color-1: #181c22;\n  --body-radial-color-2: #050e29;\n}\n\n*{\n  @apply outline-none focus-visible:outline-darkblue-100 focus-visible:ring-darkblue-100 rounded-sm;\n}\n\na {\n  font-weight: 500;\n  color: #646cff;\n  text-decoration: inherit;\n}\na:hover {\n  color: #535bf2;\n}\n\nbody {\n  background: radial-gradient(circle at center, var(--body-radial-color-1) 0%, var(--body-radial-color-2) 100%);\n  min-height : 100vh;\n}\n\n/* div[data-state="open"][aria-hidden="true"][data-aria-hidden="true"] {\n  @apply opacity-50;\n}\n\n#add-recipe-dialog{\n  @apply bg-card-500;\n}\n\n#warning-dialog{\n  @apply bg-card-500;\n} */\n\nbutton[data-state="active"]>span#tabs-trigger-active {\n  @apply text-def-100;\n}\n\ndiv[cmdk-list][role="listbox"] {\n  @apply bg-darkblue-300 max-h-52 text-def-100 rounded-sm border-def-200;\n}\n\ndiv[cmdk-item][role="option"] {\n  @apply text-def-100 opacity-100 hover:bg-darkblue-200 py-[3px] focus:bg-darkblue-200 focus-visible:bg-darkblue-200 pointer-events-auto focus-within:bg-darkblue-200 ;\n}\n\ndiv[data-border="true"] {\n  @apply outline-darkblue-100;\n}\n\nbutton[data-action="badge-button-remove"] {\n  @apply bg-transparent text-def-100;\n}\n\nbutton[data-action="generate-instructions"]{\n  @apply hover:no-underline no-underline;\n}\n\ninput[cmdk-input][role="combobox"]{\n  @apply bg-darkblue-300 text-def-100 min-w-[38rem];\n}\n\ndiv[data-badge="outline"]{\n  @apply bg-def-500 select-none;\n\n}\n\n\n.translate-center  {\n  transform: translate(-50%, -50%);\n  top: 50%;\n  left: 50%;\n}\n\n.translate-center-t40 {\n  transform: translate(-50%, -50%);\n  top: 40%;\n  left: 50%;\n}\n\n.first-layer {\n  z-index : 9999;\n}\n\n.horizontal {\n  display: flex;\n  flex-direction: row;\n}\n\n.vertical {\n  display: flex;\n  flex-direction: column;\n}\n\nh1 {\n  font-size: 3.2em;\n  line-height: 1.1;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: "Montserrat", sans-serif;\n}\nh2,\nh3,\nh4,\nh5,\nh6 {\n  @apply text-darkblue-100;\n}\n\nbutton {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.4em 0.8em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: #1a1a1a;\n  cursor: pointer;\n  color: #e8e8e8;\n  /* outline: -webkit-focus-ring-color auto 5px #535bf2; */\n}\n\nbutton.menu {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.1em 0.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: transparent;\n  cursor: pointer;\n  transition: border-color 0.25s;\n  color: #e8e8e8;\n}\n/* button:focus,\nbutton:focus-visible {\n  outline: 4px auto -webkit-focus-ring-color;\n} */\n\n#root {\n  @apply sm:p-4 md:p-8 p-1;\n  /* max-width: 1280px; */\n  margin: 0 auto;\n  text-align: left;\n}\n\n\n\ntable {\n  width: 100%;\n}\ntd {\n  padding: 1px 3px;\n}\nth {\n  @apply border-b-2 border-darkblue-100;\n  padding: 15px 7px;\n}\n\n.font-montserrat {\n  font-family: "Montserrat", sans-serif;\n}\n.card {\n  @apply rounded-lg border-[1px] border-black/40 shadow-inner-shadow-dark-sm;\n}\n/*  */\n\n.shadow-inner-shadow-dark-sm {\n  --tw-shadow: 0px 1px 0px 0px hsla(0, 0%, 100%, 0.02) inset, 0px 0px 0px 1px hsla(0, 0%, 100%, 0.02) inset,\n    0px 0px 0px 1px rgba(0, 0, 0, 0.25);\n  --tw-shadow-colored: inset 0px 1px 0px 0px var(--tw-shadow-color), inset 0px 0px 0px 1px var(--tw-shadow-color),\n    0px 0px 0px 1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.button-wave {\n  position: absolute;\n  background: 0 0;\n  pointer-events: none;\n  box-sizing: border-box;\n  @apply text-darkblue-50;\n  box-shadow: 0 0 0 0 currentColor;\n  opacity: 0.2;\n}\n\n.button-wave.wave-motion-appear {\n  --cb-ease-out: cubic-bezier(0.08, 0.82, 0.17, 1);\n  transition: box-shadow 0.4s cubic-bezier(0.08, 0.82, 0.17, 1), opacity 2s cubic-bezier(0.08, 0.82, 0.17, 1);\n}\n\n.button-wave.wave-motion-appear-active {\n  box-shadow: 0 0 0 6px currentColor;\n  opacity: 0;\n}\n\n.button-wave.wave-motion-appear.wave-quick {\n  --cb-ease-in-out: cubic-bezier(0.78, 0.14, 0.15, 0.86)\n  transition: box-shadow 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86), opacity 0.35s cubic-bezier(0.78, 0.14, 0.15, 0.86);\n}\n\n/* CHECKBOX */\n\n.checkbox-ctn {\n  @apply px-3;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 1rem 0;\n}\n\n/* Hide the default checkbox */\n.checkbox-container input {\n  position: absolute;\n  opacity: 0;\n  cursor: pointer;\n  height: 0;\n  width: 0;\n}\n\n.checkbox-container {\n  display: block;\n  position: relative;\n  cursor: pointer;\n  font-size: 1.5rem;\n  user-select: none;\n}\n\n/* Create a custom checkbox */\n.checkmark {\n  --clr: #54669dff;\n  position: relative;\n  top: 0;\n  left: 0;\n  height: 0.8em;\n  width: 0.8em;\n  background-color: #ccc;\n  border-radius: 50%;\n  transition: 300ms;\n}\n\n/* When the checkbox is checked, add a blue background */\n.checkbox-container input:checked ~ .checkmark {\n  background-color: var(--clr);\n  border-radius: 0.18rem;\n  animation: pulse 500ms ease-in-out;\n}\n\n/* Create the checkmark/indicator (hidden when not checked) */\n.checkmark:after {\n  content: "";\n  position: absolute;\n  display: none;\n}\n\n/* Show the checkmark when checked */\n.checkbox-container input:checked ~ .checkmark:after {\n  display: block;\n}\n\n/* Style the checkmark/indicator */\n.checkbox-container .checkmark:after {\n  left: 0.25em;\n  top: 0.1em;\n  width: 0.3em;\n  height: 0.5em;\n  border: solid #e0e0e2;\n  border-width: 0 0.15em 0.15em 0;\n  transform: rotate(45deg);\n}\n\n/* LOADER */\n\n.loader {\n  --color: #a5a5b0;\n  --size: 20px;\n  width: var(--size);\n  height: var(--size);\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 2px;\n}\n\n.loader span {\n  width: 100%;\n  height: 100%;\n  background-color: var(--color);\n  animation: keyframes-blink 0.5s alternate infinite linear;\n}\n\n.loader span:nth-child(1) {\n  animation-delay: 0ms;\n}\n\n.loader span:nth-child(2) {\n  animation-delay: 150ms;\n}\n\n.loader span:nth-child(3) {\n  animation-delay: 150ms;\n}\n\n.loader span:nth-child(4) {\n  animation-delay: 280ms;\n}\n\n@keyframes keyframes-blink {\n  0% {\n    opacity: 0.5;\n    transform: scale(0.5) rotate(20deg);\n  }\n\n  50% {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n',
                nextStep: {
                    title: ["Add this script to your package.json", "Tailwind next steps"],
                    message: [
                        '"scripts": {\n"tw:build": "npx tailwindcss -i ./tw/input.css -o ./tw/output.css",\n"tw:watch": "npx tailwindcss -i ./tw/input.css -o ./tw/output.css --watch"}',
                        "1. raz add tailwind config\n2. npm run tw:build OR npm run tw:watch",
                    ],
                    color: "blue",
                },
            },
        ],
        vscode: [
            {
                name: "config",
                fileName: "raz.config.json",
                path: path.join(outputDir.vscode.path, "raz.config.json"),
                value: '{\n  "version": 1.1,\n  "atDirectives": [\n    {\n      "name": "@tailwind",\n      "description": "Use the @tailwind directive to insert Tailwind\'s `base`, `components`, `utilities`, and `screens` styles into your CSS."\n    },\n    {\n      "name": "@apply",\n      "description": "Use the @apply directive to inline any existing utility classes into your own custom CSS."\n    }\n  ]\n}\n',
                nextStep: {
                    title: ["Add this line to your vscode settings.json"],
                    message: ['\'css.customData": [".vscode/raz.config.json"]\''],
                },
            },
        ],
        types: [
            {
                name: "index",
                fileName: "index.d.ts",
                path: path.join(outputDir.types.path, "index.d.ts"),
                value: "// Add your types here\n\n export type Prettyfy<T> = {\n  [K in keyof T]: T[K];\n};\n",
            },
        ],
    };
};
/**
 * const cliPath = process.argv[1]; // /Users/pino/.nvm/versions/node/v16.20.1/bin/raz
 */
const projectRoot = process.cwd();
const outputDir = getOutDirs(projectRoot);
const library = generateLibrary(outputDir);
const userCmd = process.argv.slice(2);
const initAction = process.argv[2]; // add
const initType = process.argv[3]; // type : component or hook or icon or tailwind or vscode or types
const initName = process.argv[4]; // name
const defaultForMain = {
    action: initAction,
    type: initType,
    name: initName,
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
function sayBye() {
    if (initAction === "add" && initType === "tailwind" && initName === "config") {
        p.note(library.tailwind[0].nextStep?.message[0], color.blue(library.tailwind[0].nextStep?.title[0]));
        p.note(library.tailwind[0].nextStep?.message[1], color.blue(library.tailwind[0].nextStep?.title[1]));
    }
    else if (initAction === "add" && initType === "tailwind" && initName === "input") {
        p.note(library.tailwind[1].nextStep?.message[0], color.blue(library.tailwind[1].nextStep?.title[0]));
        p.note(library.tailwind[1].nextStep?.message[1], color.blue(library.tailwind[1].nextStep?.title[1]));
    }
    else if (initAction === "add" && initType === "vscode" && initName === "config") {
        p.note(library.vscode[0].nextStep?.message[0], color.blue(library.vscode[0].nextStep?.title[0]));
    }
    done();
}
function done() {
    p.log.success(color.green("✔ ") + "Done");
    process.exit(0);
}
function writeToEndOfFile(path, data) {
    try {
        appendFile(path, "\r\n" + data);
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
            logIsVerbose("info", `Created ${dirType} folder`);
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
            const { path, value } = element.item;
            const method = element.item.method || "write";
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
