
CREATE DATABASE alumnos;

USE alumnos;

CREATE TABLE alumnos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    edad INT NOT NULL
);

SELECT * FROM alumnos;