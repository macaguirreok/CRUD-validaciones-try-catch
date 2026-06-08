
//import fs from "fs";// Importa el módulo fs de Node.js 
//..sirve para leer y escribir archivos en el servidor. En mi caso,
//..para manejar profesores.json como si fuera mi "base de datos".

import connection from "../database.js";

const filepath = "./alumnos.json"; //ruta del archivo json, donde está ubicado.

export const getAlumnos = async (req, res) => {

    const [alumnos] = await connection.query(
        "SELECT * FROM alumnos" 
    );

    res.status(200).json(alumnos);
}

export const getUnAlumno = async (req, res) => {
   
    //Sacamos el id de los parametros
    const idAlumno = req.params.id ;

    const [alumno] = await connection.query(
        "SELECT * FROM alumnos WHERE id = ? ",
        [idAlumno]
    );

    if( alumno.length == 0){
        res.status(404).json({
            mensaje: "No existe el alumno"
        })
    }else{
        res.status(200).json(alumno[0]);
    }

}

export const postAlumnos = async (req,res) => {
    
    const {nombre, edad} = req.body; //sacamos nombre y edad del req.body
    //en vez de armar un json con los datos, los enviamos a la bd
    //mediante una consulta sql, mediante la connection importada de
    //el archivo databas.js

    await connection.query(
        "INSERT INTO alumnos(nombre,edad) VALUES (?,?)",
        [nombre,edad]
    );

    res.status(201).json({
        mensaje:"alumno creado",
        alumno: req.body
});
}

export const deleteAlumno = async (req,res) => {
    
    const idAlumno = req.params.id ;

    const [resultado] = await connection.query(
        "DELETE FROM alumnos WHERE id = ?",
        [idAlumno]
    );

    //Acá es si no encontró a ningun alumno para borrar:
    if (resultado.affectedRows == 0){
        res.status(404).json({
            mensaje: "Alumno no encontrado"
        })
    }else{
        res.status(200).json({
            mensaje:"Alumno eliminado correctamente"
        });
    }

};

export const updateAlumno = async (req,res) => {
    
    const idAlumno = req.params.id;

    const {nombre , edad} = req.body;

    const [resultado] = await connection.query(
        "UPDATE alumnos SET nombre = ?, edad = ? WHERE id = ?",
        [nombre, edad, idAlumno]
    );

    if(resultado.affectedRows === 0){
        res.status(404).json({
            mensaje: "Alumno no encontrado"
        });

    }else{

        res.status(200).json({
            mensaje: "Alumno modificado exitosamente"
        });
    }

}