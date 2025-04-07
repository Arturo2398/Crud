document.getElementById("create").addEventListener("submit", async(event)=>{
    event.preventDefault();
    let response = await fetch("/agregarUsuario", {
        method: "POST",
        body: JSON.stringify({
            nombre: event.target.nombre.value,
            edad: event.target.edad.value,
            pelicula: event.target.pelicula.value,
            deporte: event.target.deporte.value,
            cancion: event.target.cancion.value,
            artista: event.target.artista.value,
            materia: event.target.materia.value,
            profe: event.target.profe.value
        }),
        headers: {
            "Content-Type": "application/json"
        }
})
let nuevoUsuario= document.getElementById("nuevoUsuario");
let responseJson = await response.json();
if(responseJson.message == "ok"){
    document.getElementById("nuevoUsuario").innerHTML = "Usuario con nombre '"+responseJson.nombre+"' fue creado correctamente";
}else{
    alert("Error al crear el usuario");
    nuevoUsuario.innerHTML = "Usuario no creado";
}
});

document.getElementById("read").addEventListener("submit", async(event)=>{
    event.preventDefault();
    let response = await fetch("/obtenerUsuario", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
})
let responseJson = await response.json();
let cadena = ''
if(responseJson.message == "ok"){
    for( let i = 0 ; i < responseJson.usuarios.length ; i+=1){ 
           cadena+=`<p>ID: ${responseJson.usuarios[i].id}: nombre: ${responseJson.usuarios[i].nombre} , edad: ${responseJson.usuarios[i].edad}, peliculafav: ${responseJson.usuarios[i].pelicula}
            , deportefav: ${responseJson.usuarios[i].deporte}, canciofav: ${responseJson.usuarios[i].cancion}, artistafav: ${responseJson.usuarios[i].artista}, materiafav: ${responseJson.usuarios[i].materia}, profefav: ${responseJson.usuarios[i].profe}</p>`;
    }
    document.getElementById("usuarios").innerHTML = cadena;
}else{
    alert("Error al obtener el usuario");
    nuevoUsuario.innerHTML = "Hubo un error al obtener los usuarios";
}
});
document.getElementById("readOne").addEventListener("submit", async(event)=>{
    event.preventDefault();
    let id = event.target.id.value;
    let response = await fetch("/obtenerUnUsuario", {
        method: "PUT",
        body: JSON.stringify({
            id: id
        }),
        headers: {
            "Content-Type": "application/json"
        }
})
let responseJson = await response.json();
if(responseJson.message == "ok"){
    if(responseJson.usuarios.length == 0){
        document.getElementById("usuario").innerHTML = 'El Usuario con ID: '+id+', no esta registrado';}
    else{
        document.getElementById("usuario").innerHTML = 'El Usuario con ID: '+id+', esta registrado como: "'+responseJson.usuarios[0].nombre+
        '" con edad de '+responseJson.usuarios[0].edad+' años, pelicula fav:' +responseJson.usuarios[0].pelicula+
        '" deporte fav: "'+responseJson.usuarios[0].deporte+
        '" cancion fav: " '+responseJson.usuarios[0].cancion+
        '" artista  fav: " '+responseJson.usuarios[0].artista+
        '" materia fav: " '+responseJson.usuarios[0].materia+
        '"  y su profe fav es: " ' +responseJson.usuarios[0].profe+ '"';
    }
}else{
    alert("Error al crear el usuario");
    nuevoUsuario.innerHTML = "Hubo un error al obtener el usuario";
}
});
document.getElementById("update").addEventListener("submit", async(event)=>{
    event.preventDefault();
let response = await fetch("/editarUsuario", {
        method: "PUT",
        body: JSON.stringify({
            nombre: event.target.nombre.value,
            edad: event.target.edad.value,
            pelicula: event.target.pelicula.value,
            deporte: event.target.deporte.value,
            cancion: event.target.cancion.value,
            artista: event.target.artista.value,
            materia: event.target.materia.value,
            profe: event.target.profe.value,

            id: event.target.id.value
        }),
        headers: {
            "Content-Type": "application/json"
        }
})
let responseJson = await response.json();
if(responseJson.message == "ok"){
    document.getElementById("UsuarioCambiado").innerHTML = "RESULTADOS: "+responseJson.respuesta+"  nombre, edad, pelicula, deporte, cancion, artista, materia, profe cambiado correctamente";
}else{
    alert("Error al editar el usuario");
    document.getElementById("UsuarioCambiado").innerHTML = "Hubo un error al editar el registro. "+ responseJson.message;
}
});
document.getElementById("deleteOne").addEventListener("submit", async(event)=>{
    event.preventDefault();
    let response = await fetch("/BorrarUnUsuario", {
        method: "DELETE",
        body: JSON.stringify({
            id: event.target.id.value
        }),
        headers: {
            "Content-Type": "application/json"
        }
})
let responseJson = await response.json();
if(responseJson.message == "ok"){
    if(responseJson.respuesta == 0){
        document.getElementById("UsuarioBorrado").innerHTML = "RESULTADOS: No se encontró el registro con dicho id.";
    }
    else{
    document.getElementById("UsuarioBorrado").innerHTML = "RESULTADOS: Se borraron la siguiente cantidad de registros: "+responseJson.respuesta;}
    }else{
    alert("Error al borrar el usuario");
    nuevoUsuario.innerHTML = "Hubo un error al borrar el usuario";
}
});
document.getElementById("delete").addEventListener("submit", async(event)=>{
    event.preventDefault();
let decision = confirm('¿Estas seguro que deseas borrar todos los registros?')
if(decision == true){
    let response = await fetch("/BorrarUsuarios", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
})
let responseJson = await response.json();
if(responseJson.message == "ok"){
    document.getElementById("UsuariosBorrados").innerHTML = "RESULTADOS: Se borraron la siguiente cantidad de registros: "+responseJson.respuesta;
}else{
    alert("Error borrar los usuarios");
    nuevoUsuario.innerHTML = "Hubo un error al borrar los usuarios";
}}
});
