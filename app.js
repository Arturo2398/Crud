const express = require("express")
const sesion = require("express-session")
const dotenv=require("dotenv")
const mysql= require("mysql2")
var bodyParser=require('body-parser')
const path = require('path')
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app=express()

dotenv.config()

app.use(sesion({
    secret: process.env.SESSION_SECRET || 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
    }
}))

var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Marmolejo01",
    database:"6IV8",
    port:3306
})
con.connect();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())

//Configuracion de express 

app.use(express.static(path.join(__dirname, 'pages')));

//RUTAS
app.get('/', (req, res) => { res.sendFile(__dirname + '/pages/index.html')})
app.get('/Registro', (req, res) => { res.sendFile(__dirname + '/pages/Registro.html')})
app.get('/Crud', (req, res) => { res.sendFile(__dirname + '/pages/Crud.html')})
    


app.use(
    sesion({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    })
)

function etiqueta (texto) {
    return /<[^>]+>/.test(texto); }
function validarTexto(texto) {
    return /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{1,30}$/.test(texto);
}

function detectarComandosPeligrosos(texto) {
    if (typeof texto !== 'string') return false;
    
    const comandosPeligrosos = [
        /\bdrop\b/i,
        /\bdelete\b/i,
        /\bupdate\b/i,
        /\bselect\b/i,
        /--/,
        /;/,
        /\bor\b/i,
        /\bunion\b/i,
        /\binsert\b/i,
        /\balter\b/i,
        /\bexec\b/i,
        /xp_/i
    ];

    return comandosPeligrosos.some(patron => patron.test(texto.toLowerCase()));
}


app.post('/agregarUsuario', async (req,res)=>{
    
        let nombre=req.body.nombre
        let edad = req.body.edad
        let pelicula = req.body.pelicula
        let deporte = req.body.deporte
        let cancion = req.body.cancion
        let artista = req.body.artista
        let materia = req.body.materia
        let profe = req.body.profe

        edad = parseInt(edad);
        if(etiqueta(nombre)||etiqueta(pelicula)||etiqueta(deporte)||etiqueta(cancion)||etiqueta(artista)||etiqueta(materia)
            ||etiqueta(profe)||isNaN(edad)){
            return res.status(400).send({message:"Datos Incorrectos"});}
        
        if(!validarTexto(nombre)||!validarTexto(pelicula)||!validarTexto(deporte)||!validarTexto(cancion)||!validarTexto(artista)
        ||!validarTexto(materia)){
            return res.status(400).send({message:"Solo puedes ingresar texto de entre 1 y 30 caracteres"});}

        con.query('INSERT INTO usuario (nombre,edad,pelicula,deporte,cancion,artista,materia,profe) VALUES (?,?,?,?,?,?,?,?)', [nombre,edad,pelicula,deporte,cancion,artista,materia,profe], (err, respuesta, fields) => {
            if (err) {
                console.log("Error al conectar", err);
                return res.status(500).send({message:"Error al conectar"});
            }
           
            return res.status(202).send({message:'ok',nombre: ` ${nombre}`});
        });

        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(profe, saltRounds);

        const checkUser = () => {
            return new Promise((resolve, reject) => {
                con.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], (err, respuesta) => {
                    if (err) reject(err);
                    resolve(respuesta);
                });
            });
        };

        const userExists = await checkUser();
        if (userExists.length > 0) {
            return res.status(400).send({ message: "El usuario ya existe" });
        }

        const insertUser = () => {
            return new Promise((resolve, reject) => {
                con.query('INSERT INTO usuario (usuario, nombre, apellidopaterno, apellidomaterno, edad, posición, altura, peso, nacionalidad, contraseña) VALUES (?,?,?,?,?,?,?,?,?,?)',
                    [usuario, nombre, apellidop, apellidom, edad, posicion, altura, peso, nacionalidad, hashedPassword],
                    (err, respuesta) => {
                        if (err) reject(err);
                        resolve(respuesta);
                    });
            });
        };

        await insertUser();
        const token = 'Bearer ' + jsonwebtoken.sign({ user: usuario}, process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION });

        return res.status(202).send({ 
            message: 'ok', 
            nombre: ` ${nombre}`, 
            apellidopaterno: `${apellidop}`, 
            nacionalidad: `${nacionalidad}`,
            redireccion: "/",
            token: token
        });
})

app.get('/obtenerUsuario',(req,res)=>{
    con.query('SELECT * from usuario', (err, respuesta, fields) => {
        if (err) {
            console.log("Error al conectar", err);
            return res.status(500).send({message:"Error al conectar"});
        }
        console.log(respuesta)
        return res.status(202).send({message: 'ok',usuarios: respuesta, edad: respuesta, pelicula: respuesta, deporte: respuesta, cancion: respuesta, artista: respuesta, materia: respuesta, profe: respuesta});
    });

})
app.put('/obtenerUnUsuario',(req,res)=>{
    let id=req.body.id
    if (!id) {
        return res.status(400).send({ message: "Faltan parámetros" });
    }
    if (isNaN(id)) {
        return res.status(400).send({ message: "No intentes adulterar la solicitud" });
    }
    con.query('SELECT nombre, edad, pelicula, deporte, cancion, artista, materia, profe from usuario WHERE id= (?)',[id], (err, respuesta, fields) => {
        if (err) {
            console.log("Error al conectar", err);
            return res.status(500).send({message:"Error al conectar"});
        }
        console.log(respuesta)
        return res.status(202).send({message: 'ok',usuarios: respuesta, edad: respuesta, pelicula: respuesta, deporte: respuesta, cancion: respuesta, artista: respuesta, materia: respuesta, profe: respuesta});
    });

})

app.put('/editarUsuario',(req,res)=>{
    let id=req.body.id
    let nombre=req.body.nombre
    let edad = req.body.edad
    let pelicula = req.body.pelicula
    let deporte = req.body.deporte
    let cancion = req.body.cancion
    let artista = req.body.artista
    let materia = req.body.materia
    let profe = req.body.profe

    if(!id ||!nombre ||!edad ||!pelicula ||!deporte ||!cancion ||!artista ||!materia ||!profe){
        return res.status(400).send({ message: "Faltan parámetros" });
    }

    if(isNaN(id)|| etiqueta(nombre)||etiqueta(pelicula)||etiqueta(deporte)||etiqueta(cancion)||etiqueta(artista)||etiqueta(materia)
        ||etiqueta(profe)||isNaN(edad)||!validarTexto(nombre)||!validarTexto(pelicula)||!validarTexto(deporte)||!validarTexto(cancion)||!validarTexto(artista)
    ||!validarTexto(materia)||!validarTexto(profe)){
        return res.status(400).send({ message: "no intente adulterar los parametros" });
    }
    con.query('SELECT nombre,edad,pelicula,deporte,cancion,artista,materia,profe FROM usuario WHERE id=(?)',[id] , (error, response,campos) => {
        if (error) {
            console.log("Error al conectar", err);
            return res.status(500).send({message:"Error al encontrar al usuario"});
            
        }
    if(response.length==0){
        return res.status(404).send({message:"No se encontro el usuario"});
    }
    con.query('UPDATE usuario SET nombre = (?), edad = (?), pelicula = (?), deporte = (?), cancion = (?), artista = (?), materia = (?), profe = (?) WHERE id =(?)',[nombre,edad,pelicula,deporte,cancion,artista,materia,profe,id], (err, respuesta, fields) => {
        if (err) {
            console.log("Error al conectar", err);
            return res.status(500).send({message:"Error al actualizar registro"});
        }
        console.log(respuesta.info)
        return res.status(202).send({message: 'ok',respuesta : respuesta.info});
    });});

})
app.delete('/BorrarUnUsuario',(req,res)=>{
    let id=req.body.id

    if (!id||isNaN(id)) {
        return res.status(400).send({ message: "Faltan parámetros o el id no es un número" });
    }

    con.query('DELETE usuario FROM usuario WHERE id =(?)',[id], (err, respuesta, fields) => {
        if (err) {
            console.log("Error al conectar", err);
            return res.status(500).send({message:"Error al conectar"});
        }
        console.log(respuesta)
        return res.status(202).send({message: 'ok',respuesta : respuesta.affectedRows});
    });

})

app.delete('/BorrarUsuarios',(req,res)=>{
    
    con.query('DELETE usuario FROM usuario;', (err, respuesta, fields) => {
        if (err) {
            console.log("Error al conectar", err);
            return res.status(500).send({message:"Error al conectar"});
        }
        console.log(respuesta)
        return res.status(202).send({message: 'ok',respuesta : respuesta.affectedRows});
    });

})



//Sesiones ekisde
app.put('/login', async (req, res) => {
    try {
        let { usuario, profe } = req.body;
        
        if([usuario,profe].some(detectarComandosPeligrosos)){
            return res.status(400).send({ message: "No intentes adulterar la solicitud" });
        }
        if (!usuario || !profe) {
            return res.status(400).send({ message: "Faltan parámetros" });
        }
        if (!validarUsuario(usuario) || contieneEtiquetaHTML(usuario) || contieneEtiquetaHTML(profe)) {
            return res.status(400).send({ message: "No intentes adulterar la solicitud" });
        }

        // Obtener usuario y contraseña hasheada
        const [user] = await con.promise().query(
            'SELECT id, contraseña FROM usuario WHERE usuario = ?', 
            [usuario]
        );

        if (user.length === 0) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        // Comparar contraseñas
        const match = await bcrypt.compare(profe, user[0].contraseña);
        if (!match) {
            return res.status(401).send({ message: "Contraseña incorrecta" });
        }

        const token = 'Bearer ' + jsonwebtoken.sign({ user: usuario }, process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION });

        return res.status(200).send({ 
            message: 'ok', 
            respuesta: user[0].id, 
            redireccion: "/", 
            token: token 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Error al iniciar sesión" });
    }
});
//******************************************************************************************************************* */
app.put('/verificar-sesion', async (req, res) => {
    try {       
        
        const token = req.body.usuario;
        
    if([token].some(detectarComandosPeligrosos)){
        return res.status(400).send({ message: "No intentes adulterar la solicitud" });
    }
        console.log('Token recibido:', token);
        if (!token || !token.startsWith('Bearer ')) {
            return res.json({ sesionActiva: false });
        }
        
        const tokenParts = token.split(' ');
        const tokenValue = tokenParts[1];
        try {
            const decodificada = jsonwebtoken.verify(tokenValue, process.env.JWT_SECRET);
            const [rows] = await con.promise().query(
                'SELECT id FROM usuario WHERE usuario = ?', 
                [decodificada.user]
            );

            if (rows.length === 0) {
                return res.json({ sesionActiva: false });
            }

            return res.json({ sesionActiva: true });
        } catch (tokenError) {
            console.error('Error al verificar token:', tokenError);
            return res.json({ sesionActiva: false });
        }
    } catch (error) {
        console.error('Error en verificación de sesión:', error);
        return res.json({ sesionActiva: false });
    }
});

app.listen(3000,()=>{
    console.log('Servidor escuchando en el puerto 3000')
})