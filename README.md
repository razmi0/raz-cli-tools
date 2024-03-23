## RAZ CLI

Allow you to add components, hooks, icons, and tailwind config to your project with a single command.

<small>**Note:** This is a work in progress. The CLI is not yet published to npm.</small>

### Usage

```bash
raz <action> <type> <name>
```

### Actions

- `add` : Add a component, hook, icon, or tailwind config to your project.
- `list` : List all available components, hooks, icons, or tailwind configs.

### Types and Names

- `component` : Add a component to your project.
  - `Hello` : Add a component named `Hello`.
    > raz add component Hello
- `hook` : Add a hook to your project.
  - `useHello` : Add a hook named `useHello`.
    > raz add hook useHello
- `icon` : Add an icon to your project.
  - `hello` : Add an icon named `HelloIcon`.
    > raz add icon hello
- `tailwind` : Add a tailwind config to your project.
  - `config` : Add a tailwind config file.
    > raz add tailwind config
  - `input` : Add a tailwind input file.
    > raz add tailwind input

If you want to list all available components, hooks, icons, or tailwind configs, you can use the `list` action.

```bash
raz list
```

Automatically create the necessary folders if they don't exist.
