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

### Types and Names

<details>
  <summary>Components</summary>
  <ul>
    <li>Button</li>
    <li>Hello</li>
  </ul>
</details>
<details>
  <summary>Hooks</summary>
  <ul>
    <li>useHello</li>
  </ul>
</details>

<details>
  <summary>Icons</summary>
  <ul>
    <li>Hello</li>
  </ul>
</details>
<details>
  <summary>Tailwind Configs</summary>
  <ul>
    <li>config</li>
    <li>input</li>
  </ul>
</details>
<br />
<br />
<p>If you want to list all available components, hooks, icons, or tailwind configs, you can use the `list` action.</p>

```bash
$ raz list
```

Automatically create the necessary folders if they don't exist.
