const express = require("express");
require("dotenv").config();
const {dbConnection} = require("./database/config");
const cors = require("cors");

console.log(process.env);

//TODO crear el servidor de express
const app = express();

//Directorio publico
app.use( express.static("public"));

//Database
dbConnection();

//CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use("/api/auth", require("./routes/auth") );
app.use("/api/events", require("./routes/events") );

//TODO CRUD: eventos
//


//Escuchar peticiones
app.listen(process.env.PORT, () =>{
    console.log(`Server running on port ${process.env.PORT}`)
});