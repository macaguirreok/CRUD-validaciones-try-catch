//Archivo de conexión

import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    database: "alumnos"
});

export default connection;