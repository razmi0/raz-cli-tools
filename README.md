## RAZ CLI

Allow you to add prebuilt components, hooks, icons, and tailwind config to your project with a single command.

<small>**Note:** This is a work in progress. The CLI is not yet published to npm.</small>

### Installation

```bash
> $ git clone https://github.com/razmi0/raz-cli-tools.git
> $ cd raz-cli-tools
> $ npm install -g
> $ raz list
```

### Usage

```bash
$ raz <action> <type> <name>
```

### Actions

- `add` : Add a component, hook, icon, or tailwind config to your project.
- `list` : List all available elements and configs.
- `init` : Initialize the project with the necessary folders and files.

### Types and Names

<details>
  <summary>Components</summary>
  <ul>
    <li>Button</li>
    <li>Drawer no-Js</li>
    <li>Modal no-Js</li>
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
<details>
  <summary>Linter</summary>
  <ul>
    <li>config</li>
  </ul>
</details>
<details>
  <summary>Util</summary>
  <ul>
    <li>makefile checkpoint add commit push</li>
  </ul>
</details>
<details>
  <summary>Textures</summary>
  <ul>
    <li>mosaic</li>
    <li>charcoal-smudge</li>
    <li>mathematics</li>
    <li>dots</li>
    <li>snow</li>
    <li>dust</li>
    <li>speckles</li>
    <li>grunge</li>
    <li>squares</li>
    <li>lines</li>
    <li>stars</li>
    <li>math</li>
    <li>wood</li>
    <li>cotton</li>
    <li>cubes</li>
    <li>paper-fibers</li>
    <li>denim</li>
    <li>paper</li>
    <li>pinstripe</li>
    <li>diag</li>
  </ul>
</details>

<br />
<br />

Will ask to create new folders and files in the project if they don't exist.

### Flags

<p> Don't write the entire type argument, use flags :</p>

> Example: `raz add -c Button`

- `-c` : Type component.
- `-i` : Type icon.
- `-h` : Type hook.
- `-t` : Type tailwind config.
- `-v` : Type vsCode config.
- `-T` : Type usefull types.
- `-l` : Type linter config.
- `-u` : Type utils.
- `-I` : Type textures.
- `-V` : Toggle verbose mode.
- `--verbose` : Verbose mode.
- `-H` : Log flags and list all items.
- `--help` : Help.

### Td

---

- [ ] fix : raz add => !forderExist ? => no file writed (replace with check at start , see todo)
- [ ] service : convertion tw <=> css
