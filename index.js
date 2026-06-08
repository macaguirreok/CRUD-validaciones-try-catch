
import express from "express";

//Importamos el router, que exportamos en alumnosRouter.
import alumnosRouter from "./routes/alumnosRoutes.js";

// El famoso servidor!!!!!!
const app = express();

const port = 3000;

//Middleware
//PERMITE RECIBIR JSON DESDE THUNDER CLIENT/POSTMAN.
/* En el proyecto anterior, los datos los convertía manualmente,
de JSON a JS, y viceversa según necesitara.
Ahora, este middleware es quién los va a convertir automáticamente,
pero SOLO JSON -> JS, NO al revés. */
/* Posteriormente, lo guarda en req.body al objeto en JS. 
req -> request, la petición que llega al servidor.
body -> cuerpo de la petición (datos que mandó el cliente) y todo,
gracias a este middleware de express.*/
app.use(express.json()); 

//El middleware para manejar la ruta de alumnos
app.use("/alumnos" , alumnosRouter);

//Levanta el servidor
app.listen( port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});

