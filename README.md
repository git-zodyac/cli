# Zodyac CLI
The CLI tool for creating and managing [Zodyac](https://zodyac.dev) projects.

Please refer to the [Zodyac documentation](https://zodyac.dev) for more information.

## Installation
```bash
npm install -g @zodyac/cli
```
## Usage
```bash
zy --help
```
## Commands
### `zy init`

Initializes a new Zodyac project in the current directory.
Generates a `package.json` file and installs the latest version of Zodyac.
Options:
- `-p, --project <name>`: The name of the project.
- `-r, --router`: Whether to generate a router module.
- `--skip-eslint`: Skips the installation of ESLint.
- `--skip-git`: Skips Git initialization.
- `--skip-docker`: Skips creating Dockerfile.

### `zy build`
Builds the current Zodyac project.

### `zy serve`
Serves the current Zodyac project.

### `zy generate <type> <name>`
Generates a new Zodyac module.
Options:
- `type`: The type of module to generate. Can be one of `module`, `router`, ~~`service`~~, ~~`model`~~ or ~~`crud`~~.
> Note: Only `module` and `router` are currently supported.
- `name`: The name of the module/router to generate.

### `zy add <type>`
Adds an extention to the current project. You can add:
- `express`: Adds [Express.js](https://expressjs.com/) API Engine.
- `eslint`: Adds `ESLint` and configuration.
- `git`: Initializes `Git` repository and `.gitignore`.
- `docker`: Creates `Dockerfile` and `.dockerignore`.


## License
MIT
