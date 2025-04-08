console.log("Error");
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