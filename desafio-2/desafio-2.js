const fs = require('fs')

class Contenedor {
    constructor(nombreArchivo) {
        this.rutaArchivo = `./${nombreArchivo}.txt`
    }

    async getAll() {
        try {
            let data = await fs.promises.readFile(this.rutaArchivo, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }

    async save(producto) {
        const content = await this.getAll()
        let id
        if (content.length === 0) {
            id = 1
        } else {
            id = content[content.length - 1].id + 1
        }
        const newObj = {
            ...producto,
            id
        }
        content.push(newObj)

        try {
            await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(content, null, 4))
            return id
        } catch (error) {
            throw new Error("Error" + error)
        }
    }

    async getById(id) {
        try {
            const content = await this.getAll()
            if (content.length > 0) {
                const obj = content.find(obj => obj.id === id)
                if (obj) return obj
            }
            throw new Error(`Objecto no encontrado con ID: ${id} en el ARCHIVO: ${this.rutaArchivo}`)
        } catch (error) {
            throw new Error(`Error al obtener el objeto con ID: ${id} del ARCHIVO: ${this.rutaArchivo} `)
        }
    }

    async deleteById(id) {
        try {
            const content = await this.getAll()
            if (content.length > 0) {
                const index = content.findIndex(obj => obj.id === id)
                if (index === -1) {
                    throw new Error(`No se puede eliminar el objeto con ID: ${id} porque no existe en el ARCHIVO: ${this.rutaArchivo}`)
                } else {
                    content.splice(index, 1)
                    const text = JSON.stringify(content, null, 2)
                    await fs.promises.writeFile(this.rutaArchivo, text)
                }
            }
        } catch (error) {
            throw new Error(`Error al eliminar el objeto con ID: ${id} del ARCHIVO: ${this.rutaArchivo} \n\t Más info: ${error.message}`)
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.rutaArchivo, '')
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
    await productos.deleteAll()
    await productos.save(productoTres)
    await productos.save(productoUno)
    await productos.deleteById(2)
    await productos.getAll()
}
admProductos()

