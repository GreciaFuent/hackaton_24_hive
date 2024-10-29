import express from "express";
import bodyParser from "body-parser";
import { Table } from "./api.js"; // Importa la función de inserción
import cors from 'cors';

// Accedemos a los métodos de la base de dtaos
const table = new Table();

// Creando Framework
const app = express();
const port = 3001; // Puerto para el servidor

// Union de puertos diferente
app.use(cors());
// Middleware para analizar solicitudes JSON
app.use(bodyParser.json());

// AQUI MANEJAMOS LAS ACCIONES QUE SE REALIZARAN EN LA BASE DE DATOS
// Ruta para inserción de usuarios (/register)
app.post("/api/register", async (req, res) => {
  const { name, username, password, email, image } = req.body;
  try {

    await table.insertUser(name, username, password, email, image);
    res.status(200).send("Usuario registrado exitosamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el usuario");
  }
});

// Ruta para validar (/login)
app.post("/api/login", async (req, res) => {
  const { username, password} = req.body;
  try {

    const respuesta = await table.validateUser(username, password);

    if (!respuesta){
      throw new Error()
    }

    res.status(200).send("Usuario encontrado");
  } catch (error) {
    console.log(error);
    res.status(500).send("El usuario no fue encontrado");
  }
});

app.post("/api/fetchEvents", async (req, res) => {
  const { idUser } = req.body;
  try {
    const result = await table.fetchEvent(idUser);
    res.json(result);
    console.log("Eventos Calendario")
    console.log(result)
  } catch (error) {
    console.error(error);
    res.status(500).send("No se pudieron obtener las notas");
  }
});

// Ruta para obtener grupos en calendario
app.post("/api/fetchGroupsCalendar", async (req, res) => {
  const { idUser } = req.body;
  try {
    console.log(idUser)
    const result = await table.fetchGroupCalendar(idUser);
    console.log("Grupos Calendario")
    console.log(result)
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("No se pudieron obtener las notas");
  }
});

// ROBERTO CALDERON
// Ruta para sacar los grupos 
app.post("/api/fetch-groups", async (req, res) => {
  const { username} = req.body;

  const result = await table.fetchGroups(username);
  res.json(result);
    
});
 // Registrar grupos
app.post("/api/registerGroup", async (req, res) => {
  const { title, tipo, fechaCreacion, userId } = req.body;
  try {

    await table.createGroup(title, fechaCreacion, tipo, userId);
    res.status(200).send("Grupo creado exitosamente.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear un nuevo grupo.");
  }
});
// Registrar eventos
app.post("/api/registerEvent", async (req, res) => {
  const { idUser, idGroup, title, description,  createdDate, expiredDate} = req.body;
  try {

    await table.createEvent(idUser, idGroup, title, description, createdDate, expiredDate);
    res.status(200).send("Grupo creado exitosamente.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear un nuevo grupo.");
  }
});

// Obtener eventos para un grupo en específico
app.post("/api/getEvent", async (req, res) => {
  const { idGroup } = req.body;
  const result = await table.getEvents(idGroup);
  res.json(result);
});

// Obtener miembros del grupo
app.post("/api/getMembers", async (req, res) => {
  const {idGroup} = req.body;
  const result = await table.getMembers(idGroup);
  res.json(result);
});

// Unir gente!
app.post("/api/linkPeople", async (req, res) => {
  const {idUser, idGroup} = req.body;
  try {
    
    await table.linkPeople(idUser, idGroup);
    res.status(200).send("Grupo creado exitosamente.");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear un nuevo grupo.");
  }
});

// Ruta Obtener notas
app.post("/api/getNotes", async (req, res) => {
  const { idUser } = req.body;
  try {
    console.log(idUser)
    const result = await table.getNotes(idUser);
    console.log(result)
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("No se pudieron obtener las notas");
  }
});

// Ruta para obtener notas Feed
// Obtener eventos para el mural
app.post("/api/getEventsFeed", async (req, res) => {
  const { username } = req.body;
  const result = await table.getEventsFeed(username);
  res.json(result);
  console.log("FEED")
  console.log(result)
});

// Ruta para obtener data
app.post("/api/getNotesFeed", async (req, res) => {
  const { username } = req.body;
  try {
    const result = await table.getNotesFeed(username);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("No se pudieron obtener las notas");
  }
});

// Ruta para insertar notas
app.post("/api/insertNote", async (req, res) => {
  const {idUser, information, confirmatedDate} = req.body;
  try {
    await table.insertNote(idUser, information, confirmatedDate);
    res.status(200).send("Nota insertada conrrectamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Nota no insertada");
  }
});



// Ruta para eliminar
app.post("/api/deleteNotes", async (req, res) => {
  const { idNote} = req.body;
  try {
    console.log(idNote)
    const result = await table.deleteNotes(idNote);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("No se pudieron obtener las notas");
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
