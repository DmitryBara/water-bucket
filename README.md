# water-bucket

### By docker

Be sure that next ports are available (close all application, databases, containers etc.)

`3005` - for frontend; `8020` - for backend; `5432` - for postgres

and then run `docker-compose up --build`.

When you make some changes they will be automatically delivered inside container.
If you need make test inside docker container just execute:
`docker exec -it <container-id> npm run test`.
Find id of backend-container you can runnning `docker ps` in console.

### By npm

1. Set environment variable in `client/.env`:
```BACKEND_SERVER=http://localhost:8020```

2. From root run `npm install` and `npm run client:install`.

3. Syncronyze settings in `.env` file with your database (login, password, host).
Be sure that you have 2 databases at server: DB_WORK and DB_TEST.
Then run `npm run dev`. This command will start frontend and backend concurrently.

4. You could make tests by `npm run test`


__Web application with UI will be available on http://localhost:3005/__

