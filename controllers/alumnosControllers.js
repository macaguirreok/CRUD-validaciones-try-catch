
import connection from "../database.js";

const filepath = "./alumnos.json"; //ruta del archivo json, donde está ubicado.



export const getAlumnos = async (req, res) => {

    try{

    //Intentá realizar la consulta normalmente
    const [alumnos] = await connection.query(
        "SELECT * FROM alumnos" 
    );

    res.status(200).json(alumnos);


    //Si algo sale mal, arrojá un error:
    }catch(error){


    //a) mensaje amigable para el cliente
    console.error(error); //Se usa en vez del console.log , es para mostrar errores por consola.

    //b) el servidor muestra el error real
    res.status(500).json({
        mensaje: "Error interno del servidor "
    });

    }
};





export const getUnAlumno = async (req, res) => {

    //? AFUERA del try, porque es algo que se hace ANTES de la bd

    //Sacamos el id de los parametros
    const idAlumno = req.params.id ;

    //Validación de que idAlumno, efectivamente sea un número
    if(isNaN(idAlumno)){

        return  res.status(400).json({
            mensaje: "El id debe ser numérico"
        });
    }


    try{


    const [alumno] = await connection.query(
        "SELECT * FROM alumnos WHERE id = ? ",
        [idAlumno]
    );

    //404 -> El cliente preguntó algo que no existe
    //Validación si es que el alumno no existe:
    if( alumno.length == 0){ //si el array es vacío [ ]
        res.status(404).json({
            mensaje: "No existe el alumno"
        })
    }else{
        res.status(200).json(alumno[0]); //si llegó al else, el array tiene el alumno
    }


    }catch(error){

  
    //a) mensaje amigable para el cliente
    console.error(error);

    //b) el servidor muestra el error real
    res.status(500).json({
        mensaje: "Error interno del servidor"
    });

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