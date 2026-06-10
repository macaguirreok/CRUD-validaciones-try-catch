
import connection from "../database.js";


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

    //*Validación de que idAlumno, efectivamente sea un número
    if(isNaN(idAlumno)){

        return  res.status(400).json({
            mensaje: "El id debe ser numérico"
        });
    }

    //*Validación el id debe ser mayor a cero
    if(idAlumno < 1){
        return res.status(400).json({
            mensaje: "El id debe ser mayor a cero"
        })
    }

    //*No hace falta la validación de que no puede venir vacío,
    //*porque eso significaría que se está haciendo un getAll, si es que no tiene id


    try{


    const [alumno] = await connection.query(
        "SELECT * FROM alumnos WHERE id = ? ",
        [idAlumno]
    );

    //404 -> El cliente preguntó algo que no existe
    //Validación si es que el alumno no existe:
    if( alumno.length == 0){ //si el array es vacío [ ]
        return res.status(404).json({
            mensaje: "No existe el alumno"
        })
    }
       
    res.status(200).json(alumno[0]); //si llegó al else, el array tiene el alumno
    


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

    //*validación nombre y edad, no pueden venir vacíos:
    if(!nombre || !edad){
        
        return res.status(400).json({
            mensaje: "Edad y nombre, no pueden estar vacíos"
        });
    }

    //*Validación nombre no puede ser numérico

    if(!isNaN(nombre)){
       return res.status(400).json({
            mensaje: "Nombre no puede ser numérico"
        })
    }

    //*Validación edad solo puede ser numérica

    if(isNaN(edad)){

        return res.status(400).json({
            mensaje: "La edad debe ser numérica"
        });
    }

    //*Validación edad no puede ser "cero", número negativo, o mayor a 150
    //*Tipo de validación: de negocio. Lo que se permite en la app según se necesite
    if(edad < 1 || edad > 150){

       return res.status(400).json({
            mensaje: "Edad no puede ser cero, menor a cero, o mayor a 150"
        })
    }


    try{

    await connection.query(
        "INSERT INTO alumnos(nombre,edad) VALUES (?,?)",
        [nombre,edad]
    );

    res.status(201).json({
        mensaje:"alumno creado",
        alumno: req.body
});

        }catch(error){

       //*Mensaje para el desarrollador
       console.error(error);

           
        //* Mensaje amigable para el cliente:
         res.status(500).json({
        mensaje: "Error interno del servidor"
        });

        
        }
}





export const deleteAlumno = async (req,res) => {
    
    const idAlumno = req.params.id ;

    //*Validación id no puede venir vacío, SOBRA
    //*porque si se hace un delete a /alumnos, sin id, da directamente un error 404
    /*
    if(!idAlumno){
        return res.status(400).json({
            mensaje: "El id no puede venir vacío"
        });
    }   */

    //*Validación el id tiene que ser numérico

    if(isNaN(idAlumno)){
    return res.status(400).json({
        mensaje: "El id debe ser numérico"
    });
    }

    //*Validación el id debe ser mayor a cero
    if(idAlumno < 1){
       return res.status(400).json({
            mensaje: "El id debe ser mayor a cero"
        })
    }


    try{

    const [resultado] = await connection.query(
        "DELETE FROM alumnos WHERE id = ?",
        [idAlumno]
    );

    //Acá es si no encontró a ningun alumno para borrar:
    if (resultado.affectedRows == 0){
        return res.status(404).json({
            mensaje: "Alumno no encontrado"
        })
    }


    res.status(200).json({
       mensaje:"Alumno eliminado correctamente"
    });
    

    }catch(error){

        //*Mensaje para el desarrollador
        console.error(error);
        
        //*Mensaje amigable para el cliente
        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }

};





export const updateAlumno = async (req,res) => {
    
    const idAlumno = req.params.id;

    //*Validación de !idAlumno para que no venga vacío, innecesaria, porque
    //*si se quiere hacer un update solo a /alumnos da error 404


    const {nombre , edad} = req.body;

    //* Validación id numérico
    if(isNaN(idAlumno)){
        return res.status(400).json({
            mensaje: "El id debe ser numérico"
        });
    }

    //* Validación id mayor a cero
    if(idAlumno < 1){
        return res.status(400).json({
            mensaje: "El id debe ser mayor a cero"
        });
    }

    //* Validación nombre y edad obligatorios
    if(!nombre || !edad){
        return res.status(400).json({
            mensaje: "Nombre y edad no pueden estar vacíos"
        });
    }

    //* Validación nombre no puede ser numérico
    if(!isNaN(nombre)){
        return res.status(400).json({
            mensaje: "El nombre no puede ser numérico"
        });
    }

    //* Validación edad debe ser numérica
    if(isNaN(edad)){
        return res.status(400).json({
            mensaje: "La edad debe ser numérica"
        });
    }

    //* Validación de negocio
    if(edad < 1 || edad > 150){
        return res.status(400).json({
            mensaje: "La edad debe estar entre 1 y 150"
        });
    }


    try{

    const [resultado] = await connection.query(
        "UPDATE alumnos SET nombre = ?, edad = ? WHERE id = ?",
        [nombre, edad, idAlumno]
    );

    if(resultado.affectedRows === 0){
        return res.status(404).json({
            mensaje: "Alumno no encontrado"
        });

    }

        res.status(200).json({
            mensaje: "Alumno modificado exitosamente"
        });

    }catch(error){

        //*Mensaje para el desarrollador
        console.error(error);

        //*Mensaje amigable para el cliente
        res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
    

}