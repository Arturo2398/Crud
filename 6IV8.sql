drop database 6IV8;
create database 6IV8;

use 6IV8;

create table usuario (
id integer auto_increment,
nombre char(120),
edad char(120),
pelicula char(120),
deporte char(120),
cancion char(120),
artista char(120),
materia char(120),
profe char(120),
primary key(id)
);

select id, nombre, edad, pelicula, deporte, cancion, artista, materia, profe from usuario;