# water-bucket

### By docker

Be sure that next ports are available (close all application, databases, containers etc.)

`3005` - for frontend; `8020` - for backend; `5432` - for postgres

and then run `docker-compose up --build`.

When you make some changes they will be automatically delivered inside container.
If you need make test inside docker container just execute:
`docker exec -it backend-container npm run test`

### By npm

set environment variable in client/.env:
`BACKEND_SERVER=http://localhost:8020`

Syncronyze settings in .env file with your database.
Be sure that at your server you have 2 databases: POSTGRES_DB_WORK and POSTGRES_DB_TEST. 
Then run `npm run dev`. This command will run frontend and backend concurrently.

__Web application with UI will be available on http://localhost:3005/__

