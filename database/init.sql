CREATE DATABASE IF NOT EXISTS pkmn;
USE pkmn;

CREATE TABLE IF NOT EXISTS teams(
id INT PRIMARY KEY,
name VARCHAR (64)
);

INSERT INTO teams (id, name)
VALUES ('1', 'rocket');

INSERT INTO teams (id, name)
VALUES ('2', 'hash');


