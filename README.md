# water-bucket

### By docker

Application can be started by `docker-compose up --build`.
Be sure that next ports are available:

`3005` - for frontend; `8020` - for backend; `5432` - for postgres.

When you make some changes they will be automatically delivered inside container.
If you need make test inside docker container just execute:
`docker exec -it <container name> npm run test`

### By npm

set environment variable in client/.env:
`BACKEND_SERVER=http://localhost:8020`

Syncronyze settings in .env file with your database.
Be sure that at your server you have 2 databases: POSTGRES_DB_WORK and POSTGRES_DB_TEST. 
Then run `npm run dev`. This command will run frontend and backend concurrently.

Web application with UI will be available on http://localhost:3005/

