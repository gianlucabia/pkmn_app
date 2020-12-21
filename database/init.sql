CREATE DATABASE pkmn;
USE pkmn;

CREATE TABLE teams(
id INT PRIMARY KEY,
name VARCHAR (64)
);

CREATE TABLE pokemon(
groupid INT FOREIGN KEY REFERENCES pokemon(id),
pokeid INT
);


