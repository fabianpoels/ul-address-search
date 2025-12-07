# UL Address Search

A minimal application for searching addresses in a JSON file.

Tech stack (more details below):

- React
- Nodejs + Express
- Typescript

## Development environment

The project is set up to be run with VScode and devcontainers, allowing for a smooth developer experience.

### Requirements

- Docker
- VScode + Dev Containers extension

### Setup

#### 1. Clone the repository and open in VScode

```bash
git clone git@github.com:fabianpoels/ul-address-search.git
cd ul-address-search
code .
```

#### 2. Open the as a devcontainer

```
VScode > Commands > Dev Containers: Rebuild and Reopen in container
```

This will build the container and install the required dependencies

#### 3. Run the application

From inside VScode, open a terminal and run:

```bash
yarn dev
```

This will start both the API and the frontend in development mode, supporting hot code reloading.
The frontend will be available at [http://localhost:5173](http://localhost:5173)

### Troubleshooting

The devcontainer exposes ports `8080` and `5173`. Make sure they are not in use on your local machine to prevent conflicts. If - for whatever reason - those ports are not available, they can be adjusted in `docker-compose.yml`:

```yaml
ports:
  - '5173:5173' # Vite (frontend)
  - '8080:8080' # Nodejs/express (api)
```

## Architecture

The assignment only made mention of a single repository as a deliverable, so I went with a monorepo approach. To minimze the dependency on a specific operation system or locally installed software packages, I opted to set up a development environment using devcontainers. This allows the project to be set up for development.

To manage the project as a single repository but still have a separation of code and concerns, I choose to use Yarn workspaces for package management. The main components of the application are:

- API: nodejs + Express (typescript)
- frontend: React (typescript)
