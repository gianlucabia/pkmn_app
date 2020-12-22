# The Pokèmon App

This repository contains all the needed files for the project.

- [Application](#application)
- [Database](#database)
- [Deploy](#deploy)


### Application

The Pokèmon App is located inside the `pkmn_app` folder. It developed according in [node.js](https://nodejs.org/it/) and JS, exploiting the [Express](https://expressjs.com/) framework and the frontend uses HTML and CSS.

### Database

The data layer of the Pokèmon App is handled by MySQL.

In order for the application to properly interact with the database, this must be available on `poke_database:3306`, the database name should be `pkmn`, the user `root` with password `MyPass-1`.

## Deploy

You can deploy The Pokèmon App with the `docker-compose.yml` file, capable of deploying both the application and the database. You simply need build and start the services.

```sh
docker-compose build
docker-compose up
```
