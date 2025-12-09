# UL Address Search

A sleek, fast, type-safe address autocomplete.

Tech stack (more details below):

- React
- Node.js + Express.js
- Typescript

## Preview

The application is deployed and available at [https://ul-address-search.onrender.com/](https://ul-address-search.onrender.com/)

_Note: the application is running on a free tier, so initial response times can take up to 60 seconds._

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
  - '8080:8080' # Node.js/Express.js (api)
```

**IMPORTANT**: When changing the exposed port of the API, make sure to also update the API url for the frontend at `frontend/.env`

## Architecture

The assignment only made mention of a single repository as a deliverable, so I went with a monorepo approach. To minimize the dependency on a specific operating system or locally installed software packages, I opted to set up a development environment using devcontainers. This allows the project to be set up for development with minimal dependencies.

To manage the project as a single repository but still have a separation of code and concerns, I chose to use Yarn workspaces for package management. The main components of the application are:

- API: Node.js + Express.js (typescript)
- frontend: React (typescript)
- shared: Address type shared between API and frontend (typescript)

### API

**Node.js / Express.js**

I chose to use Express.js as I am somewhat familiar with it, but a pure Node.js application would work equally well for a minimal API.

Implementing `trie-search` went effortless and I was surprised by its performance.

The API exposes a single endpoint:

<details>
 <summary><code>GET</code> <code><b>/search/:query</b></code> <code>Searches for addresses matching the query string</code></summary>

##### Parameters

> | name  | type     | data type            | description                                 |
> | ----- | -------- | -------------------- | ------------------------------------------- |
> | query | required | string (min 3 chars) | The search query to match addresses against |

##### Responses

> | http code | content-type       | response                  |
> | --------- | ------------------ | ------------------------- |
> | `200`     | `application/json` | Array of address objects  |
> | `400`     | `application/json` | Error object with details |

##### Example Response (200)

```json
[
  {
    "postNumber": 7042,
    "city": "TRONDHEIM",
    "street": "Testmanns gate",
    "typeCode": 6,
    "type": "Gate-/veg-adresse",
    "district": "",
    "municipalityNumber": 1601,
    "municipality": "Trondheim",
    "county": "Sør-Trøndelag"
  }
]
```

##### Example Response (400)

```json
{
  "error": "Bad Request",
  "message": "Search query must be at least 3 characters"
}
```

</details>

### frontend

**React**

The frontend is built using React as specified. Without being able to rely on prebuilt components, providing a seamless UX is not a straightforward task. My main consideration when building the input field, was the interaction between the speed of the user input and the required network requests to the API. Instead of going for a 'debounce' approach, I opted to:

- Fire a request on every keystroke
- Cancel previous requests when a new request is triggered

This allows for network requests without delays and also avoids parsing data that might no longer be relevant to the input.

### shared

To enforce a consistent data model between the API and the frontend, I included a shared `Address` type. This approach avoids code duplication and ensures type safety across the API boundary. If the backend data structure changes, TypeScript will immediately flag any incompatibilities in the frontend at compile time rather than discovering them at runtime.

## Testing

The API includes both unit and integration tests. For convenience, I opted to use the provided dataset for the unit tests. In a true production environment, one would expect that the actual data changes over time (or lives in a database), so a separate dataset for testing would be better.

To run the tests, there are multiple commands available:

```bash
# run all tests
yarn workspace api test

# run unit tests
yarn workspace api test:unit

# run integration tests
yarn workspace api test:integration

# run tests with hot code reloading enabled
yarn workspace api test:watch
```

The tests are also run automatically on pushes to the main branch (with GitHub Actions).

## Deployment

The application deployed and available at [https://ul-address-search.onrender.com/](https://ul-address-search.onrender.com/)

The API and frontend are deployed separately, as they both require a specific setup:

- API: runs as a built Node.js server
- frontend: is built and then deployed as a static website

Using [Render](https://render.com) for this was quite straightforward, as it integrates well with GitHub (thus there is no explicit CD configuration present in the project codebase). Even the free tier offers access to the logs and some basic monitoring. For a true production-ready application, more extensive monitoring and alerting would be beneficial.
