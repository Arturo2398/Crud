const express = require("express")
const dotenv=require("dotenv")
const mysql= require("mysql2")
var bodyParser=require('body-parser')
var app=express()
dotenv.config()
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
app.use(express.static('public'))

app.post('/agregarUsuario',(req,res)=>{

        let nombre=req.body.nombre
        let edad = req.body.edad
        let pelicula = req.body.pelicula
        let deporte = req.body.deporte
        let cancion = req.body.cancion
        let artista = req.body.artista
        let materia = req.body.materia
        let profe = req.body.profe

        con.query('INSERT INTO usuario (nombre,edad,pelicula,deporte,cancion,artista,materia,profe) VALUES (?,?,?,?,?,?,?,?)', [nombre,edad,pelicula,deporte,cancion,artista,materia,profe], (err, respuesta, fields) => {
            if (err) {
                console.log("Error al conectar", err);
                return res.status(500).send({message:"Error al conectar"});
            }
           
            return res.status(202).send({message:'ok',nombre: ` ${nombre}`});
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
app.listen(3000,()=>{
    console.log('Servidor escuchando en el puerto 3000')
})