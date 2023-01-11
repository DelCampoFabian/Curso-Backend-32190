// CONSIGNA:

/* Realizar un proyecto de servidor basado en node.js que utilice el módulo express e implemente los siguientes endpoints en el puerto 8080:
Ruta get '/productos' que devuelva un array con todos los productos disponibles en el servidor
Ruta get '/productoRandom' que devuelva un producto elegido al azar entre todos los productos disponibles
Incluir un archivo de texto 'productos.txt' y utilizar la clase Contenedor del desafío anterior para acceder a los datos persistidos del servidor.
 */

const express = require("express")
const app = express()
const PORT = 8080

const Contenedor = require('./contenedor')

const productos = new Contenedor ("productos")


app.get("/productos", (req, res)=> {
    productos.getAll()
    .then(data => res.send(data))
    .catch(error => res.send(error))
})

app.get("/productoRandom", (req, res) => {
    productos
      .getAll()
      .then((data) => {
        const random = Math.floor(Math.random() * data.length);
        res.send(data[random]);
      })
      .catch((error) => {
        console.log(error.message);
        res.send({ error: error.message });
      });
  });

const server = app.listen(PORT, ()=> {
    console.log("App escuchando en el puerto: " + PORT)
})

server.on("error", (error) => console.log("error en el server:", error));
