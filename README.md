# The Pokèmon App

This repository contains all the needed files for the project.

- [Application](#application)
- [Database](#database)
- [Deploy](#deploy)
- [Acknowledgement](#acknowledgement)


### Application

The Pokèmon App is located inside the `pkmn_app` folder. It is developed according to [node.js](https://nodejs.org/it/) and JS, exploiting the [Express](https://expressjs.com/) framework, while the frontend uses HTML, CSS and the [EJS](https://ejs.co/) template engine.

### Database

The data layer of the Pokèmon App is handled by MySQL.

In order for the application to properly interact with the database, this must be available on `poke_database:3306`, the database must be named `pkmn`, the user must be `root` with password `MyPass-1`.

## Deploy

You can deploy The Pokèmon App with the `docker-compose.yml` file, capable of deploying both the application and the database. You simply need build and start the services.

```sh
docker-compose build
docker-compose up
```

Here we go: you have youre Pokèmon App ready on http://localhost:8080/ .When you're done just stop it. 

```sh
docker-compose down
```

Remember to free `:8080` or `:3306` ports if necessary. 

```sh
sudo lsof -i :<port-number>
sudo kill <pid>
```

That's it :)

## Acknowledgement

Made with ❤ by GB.
