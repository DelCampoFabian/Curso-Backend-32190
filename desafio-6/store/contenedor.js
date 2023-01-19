const fs = require('fs')

module.exports = class Contenedor {
  constructor(nombreArchivo) {
    this.rutaArchivo = __dirname + `/${nombreArchivo}.txt`
    this.contID = 1
  }
  // mi clase contendor tiene:
  /*
  - metodo para guardar un archivo que recibe un objeto
  - metodo para obtener un obj por medio de su ID
  - metodo para obtener todos los objetos dentro del archivo
  - metodo para eliminar un obj por medio de su ID
  - metodo para eliminar todo los obj del archivo 
   */

  async save(obj) {
    try {
      let text = '' // Variable que va a ser llenada con la info a guardar 
      if (!fs.existsSync(this.rutaArchivo)) { //Si no existe la ruta del archivo, text va a tener ID: 1 y el obj pasado a string
        obj.id = this.contID
        text = JSON.stringify([obj])
      } else { // Si existe la ruta, voy a traer toda la info([{...},{...},{...}] || [])
        const content = await this.getAll()
        if (content.length > 0) {
          this.contID = content[content.length - 1].id + 1 // ID: el valor del ultimo elemento del [] + 1
        } else {
          this.contID = 1
        }
        obj.id = this.contID // a obj.id le doy el valor dependiendo la validacion de antes
        text = JSON.stringify([...content, obj]) // a text le doy la info que ya estaba en el content + el obj nuevo
      }
      await fs.promises.writeFile(this.rutaArchivo, text) // Creo el archivo o lo sobreescribo
      return obj.id
    } catch (error) {
      throw new Error(`Error al escribir el OBJETO: ${JSON.stringify(obj)} en el ARCHIVO: ${this.rutaArchivo}`)
    }
  }

  async getById(id) {
    try {
      const content = await this.getAll() // [{...},{...},{...}] || []
      if (content.length > 0) { // verifico que el archivo tenga info
        const obj = content.find((obj) => obj.id === id) // lo busco x su ID
        if (obj) return obj
      }
      throw new Error(
        `Objecto no encontrado con ID: ${id} en el ARCHIVO: ${this.rutaArchivo}`
      )
    } catch (error) {
      throw new Error(
        `Error al obtener el objeto con ID: ${id} del ARCHIVO: ${this.rutaArchivo}`
      )
    }
  }

  async getAll() {
    try {
      if (!fs.existsSync(this.rutaArchivo))// Si no existe el archivo mando un error
        throw new Error(
          `No se puede leer el ARCHIVO: ${this.rutaArchivo} porque no existe`
        )
      const content = await fs.promises.readFile(this.rutaArchivo, 'utf-8') // 
      if (!content.length > 0) { // Si content no es mayor a 0
        await fs.promises.writeFile(this.rutaArchivo, '[]') // creo el archivo con un array vacio
      } else {
        const array = JSON.parse(content) // Si no al contenido lo parso y retorno el array
        return array
      }
      return []
    } catch (error) {
      throw new Error(`Error al leer el ARCHIVO: ${this.rutaArchivo}`)
    }
  }

  async deleteById(id) {
    try {
      if (!fs.existsSync(this.rutaArchivo)) { // si no existe la ruta del archivo mando un error
        throw new Error(
          `No se puede eliminar el objeto con ID: ${id} del ARCHIVO: ${this.rutaArchivo} porque no existe`
        )
      } else { // Si existe lo traigo, busco el id de la info que quiero eliminar 
        const content = await this.getAll() 
        if (content.length > 0) {
          const index = content.findIndex((obj) => obj.id === id)
          if (index === -1) { // si no existe el id lanzo un error
            throw new Error(
              `No se puede eliminar el objeto con ID: ${id} porque no existe en el ARCHIVO: ${this.rutaArchivo}`
            )
          } else { // sino lo elimino y sobreescribo la ruta del archivo
            content.splice(index, 1)
            const text = JSON.stringify(content)
            await fs.promises.writeFile(this.rutaArchivo, text)
          }
        }
      }
    } catch (error) {
      throw new Error(
        `Error al eliminar el objeto con ID: ${id} del ARCHIVO: ${this.rutaArchivo}`
      )
    }
  }

  async deleteAll() {
    try {
      if (!fs.existsSync(this.rutaArchivo)) { // si no existe lanzo un error
        throw new Error(
          `No se puede limpiar el ARCHIVO: ${this.rutaArchivo} porque no existe`
        )
      } else { // si existe lo sobreescribo con un string vacio
        await fs.promises.writeFile(this.rutaArchivo, '')
        console.log(`Se limpió el ARCHIVO: ${this.rutaArchivo}`)
      }
    } catch (error) {
      throw new Error(
        `Error al limpiar el ARCHIVO: ${this.rutaArchivo}`
      )
    }
  }
}