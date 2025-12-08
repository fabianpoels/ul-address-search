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
- VScode
- VScode Dev containers extension

### Setup

#### 1. Clone the repository and open in VScode

```bash
git clone https://github.com/fabianpoels/ul-address-search.git
cd ul-address-search
code .
```

#### 2. Open the project as a devcontainer

```
VScode > Commands > Dev Containers: Rebuild and Reopen in container
```

This will build the container and install the required dependencies

#### 3a. Run the application

From inside VScode, open a terminal and run:

```bash
yarn dev
```

This will start both the API and the frontend in development mode, supporting hot code reloading.
The frontend will be available at [http://localhost:5173](http://localhost:5173)

#### 3b. Run the application in debug mode

Alternatively, the application can be started in debug mode. This allows for breakpoints to be used on the API-code.

```
VScode > Run and Debug > Debug API + Frontend
```

### Troubleshooting

The devcontainer exposes ports `8080` and `5173`. Make sure they are not in use on your local machine to prevent conflicts. If - for whatever reason - those ports are not available, they can be adjusted in `docker-compose.yml`:

```yaml
ports:
  - '5173:5173' # Vite (frontend)
  - '8080:8080' # Nodejs/express (api)
```

**IMPORTANT**: When changing the exposed port of the API, make sure to also update the API url for the frontend at `frontend/.env`

## Architecture

The assignment only made mention of a single repository as a deliverable, so I went with a monorepo approach. To minimze the dependency on a specific operation system or locally installed software packages, I opted to set up a development environment using devcontainers. This allows the project to be set up for development with minimal dependencies.

To manage the project as a single repository but still have a separation of code and concerns, I choose to use Yarn workspaces for package management. The main components of the application are:

- API: nodejs + Express (typescript)
- frontend: React (typescript)
- shared: Address type shared between API and frontend (typescript)

### API

**Nodejs / Express**

I choose to use ExpressJS as I am somewhat familiar with it, but a pure Node application would work equally well for a minimal API.

### frontend

**React**

### shared

## Testing

## Deployment

TODO:

- showing errors on frontend
- deployment + logging + monitoring
- cors

MISSING:

- debounce on search input
