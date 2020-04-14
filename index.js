const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Crear el servidor
const app = express();

//Conectar a la bbdd
conectarDB();

// Habilitar DB
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }));

//Puerto de la app
const PORT = process.env.port || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//Definir la pagina principal
app.get('/', (req, res) => {
    res.send('Hola mundo');
});

// Iniciar la app
app.listen(PORT, () => {
    console.log('Funcionando en puerto' + PORT)
})