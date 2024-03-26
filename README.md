## RAZ CLI

Allow you to add components, hooks, icons, and tailwind config to your project with a single command.

<small>**Note:** This is a work in progress. The CLI is not yet published to npm.</small>

### Usage

```bash
$ raz <action> <type> <name>
```

### Actions

- `add` : Add a component, hook, icon, or tailwind config to your project.
- `list` : List all available components, hooks, icons, or tailwind configs.
- `init` : Initialize the project with the necessary folders and files.

### Types and Names

<details>
  <summary>Components</summary>
  <ul>
    <li>Button</li>
  </ul>
</details>
<details>
  <summary>Hooks</summary>
  <ul>
  </ul>
</details>
<details>
  <summary>Icons</summary>
  <ul>
    <li>Icon (index file)</li>
    <li>Plus</li>
    <li>Minus</li>
    <li>ChevronRight</li>
    <li>Check</li>
    <li>Cross</li>
    <li>DotFilled</li>
    <li>Menu</li>
    <li>Search</li>
    <li>Settings</li>
    <li>SortAscLetters</li>
    <li>SortDescLetters</li>
    <li>SortAscNumbers</li>
    <li>SortDescNumbers</li>
  </ul>
</details>
<details>
  <summary>Tailwind Config</summary>
  <ul>
    <li>config</li>
    <li>input</li>
  </ul>
</details>
<details>
  <summary>vsCode config</summary>
  <ul>
    <li>config</li>
  </ul>
</details>
<details>
  <summary>Usefull types</summary>
  <ul>
    <li>index (append types)</li>
  </ul>
</details>
<br />
<br />
<p>If you want to list all available components, hooks, icons, or tailwind configs, you can use the `list` action.</p>

```bash
$ raz list
```

Will ask to create new folders and files in the project if they don't exist.

### Flags

- `-c` : Type component.
- `-i` : Type icon.
- `-h` : Type hook.
- `-t` : Type tailwind config.
- `-v` : Type vsCode config.

  <br />

- `-V` : Toggle verbose mode.
- `--verbose` : Verbose mode.
- `-H` : Log flags and list all items.
- `--help` : Help.
-
