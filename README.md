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

## Architecture

The assignment only made mention of a single repository as a deliverable, so I went with a monorepo approach.
