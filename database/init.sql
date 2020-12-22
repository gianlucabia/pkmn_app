CREATE DATABASE pkmn;
USE pkmn;

CREATE TABLE teams(
id INT PRIMARY KEY,
name VARCHAR(64)
);

CREATE TABLE pokemon(
teamid INT,
pokeid INT
);


