// CONSIGNA Implementar programa que contenga una clase llamada Contenedor que reciba el nombre del archivo con el que va a trabajar e implemente los siguientes métodos:

/*   
save(Object): Recibe un objeto, lo guarda en el archivo. Devuelve Number - id asignado. Metodo para guardar un objeto
getById(Number):  Recibe un id. Devuelve Object - objeto con ese id, o null si no está. Metodo para obtener un objeto
getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo. Metodo para obtener todos los objetos
deleteById(Number): void - Elimina del archivo el objeto con el id buscado. Metodo para eliminar un objeto
deleteAll(): void - Elimina todos los objetos presentes en el archivo. Metodo para eliminar todo
*/

const fs = require('fs')

class Contenedor {
    constructor(nombreArchivo) {
        this.rutaArchivo = `./${nombreArchivo}.txt`
    }

    async getAll() {
        try {
            let data = await fs.promises.readFile(this.rutaArchivo, "utf-8") //Leer los datos del txt
            return JSON.parse(data) // Parsear la informacion que me llega
        } catch (error) {
            return []
        }
    }

    async save(producto) {
        const content = await this.getAll() // Content va a traer [{productoUno}, {productoDos}] || []
        let id
        if (content.length === 0) { // Si no hay elementos en mi archivo.txt, el id del producto a guardar va a inicializar en 1 
            id = 1
        } else { // Si en el archivo hay mas de un elemento ID va a valer 1 mas que el ID del ultimo elemento
            id = content[content.length - 1].id + 1
        }
        const newObj = { // Nuevo objeto para ser pusheado al content
            ...producto,
            id
        }
        content.push(newObj)

        try {
            await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(content, null, 4)) //Sobreescribe el archivo txt con el objeto pasado por parametro + ID
            return id // Muestro el ID ingresado del nuevo objeto
        } catch (error) {
            throw new Error("Error" + error)
        }
    }

    async getById(id) {
        try {
            const content = await this.getAll() // [{},{}] || []
            if (content.length > 0) { // Si content tiene algun producto agregado lo busco:
                const obj = content.find(obj => obj.id === id) // busco el objeto que coincida con el ID pasado x parametro
                if (obj) return obj // si existe el objeto con el ID pasado x parametro devuelvo ese objeto
            }
            throw new Error(`Objeto no encontrado con ID: ${id} en el ARCHIVO: ${this.rutaArchivo}`)
        } catch (error) {
            throw new Error(`Error al obtener el objeto con ID: ${id} del ARCHIVO: ${this.rutaArchivo} `)
        }
    }

    async deleteById(id) {
        try {
            const content = await this.getAll() // [{},{}] || []
            if (content.length > 0) { // Si content tiene algun producto agregado lo busco:
                const index = content.findIndex(obj => obj.id === id) // busco el indice con el que coincida el id
                if (index === -1) {
                    throw new Error(`No se puede eliminar el objeto con ID: ${id} porque no existe en el ARCHIVO: ${this.rutaArchivo}`)
                } else {
                    content.splice(index, 1)//Me paro un elemento antes del objeto que quiero eliminar y elimino el siguiente
                    const text = JSON.stringify(content, null, 2) // Le doy el formato JSON
                    await fs.promises.writeFile(this.rutaArchivo, text) // Sobreescribo el archivo
                }
            }
        } catch (error) {
            throw new Error(`Error al eliminar el objeto con ID: ${id} del ARCHIVO: ${this.rutaArchivo} \n\t Más info: ${error.message}`)
        }
    }
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.rutaArchivo, '')// Sobreescribo el archivo con el contenido vacio
        } catch (error) {
            throw new Error(`Error al limpiar el ARCHIVO: ${this.rutaArchivo} \n\t Más info: ${error.message}`)
        }
    }

}

const productos = new Contenedor('productos')

const productoUno = {
    title: 'Laptop Asus',
    price: 3000,
    thumbnail: 'https://hiraoka.com.pe/media/catalog/product/cache/a357cb11a228eb6f7f15c0ee1ff203af/1/1/119950-1.jpg'
}
const productoDos = {
    title: 'Teclado',
    price: 300,
    thumbnail: 'https://m.media-amazon.com/images/I/61DT+r681TL._AC_SY450_.jpg'
}
const productoTres = {
    title: 'TV',
    price: 600,
    thumbnail: 'https://i.blogs.es/800731/captura-de-pantalla-2021-06-07-a-las-1.09.46/original.png'
}



async function admProductos() {
    await productos.save(productoDos)
    await productos.getAll()
    await productos.deleteById(4)
    await productos.save(productoTres)
    await productos.save(productoUno)
    
    await productos.getAll()
}
admProductos()

