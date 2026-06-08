
import {Router} from "express";
import {getAlumnos, getUnAlumno , postAlumnos, deleteAlumno, updateAlumno} from "../controllers/alumnosControllers.js";

const router = Router();

//rutas
router.get("/", getAlumnos);
router.post("/", postAlumnos);
router.get("/:id", getUnAlumno);
router.delete("/:id", deleteAlumno);
router.put("/:id", updateAlumno);

export default router;