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
                console.log(obj)
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
                console.log(index)
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
            console.log(`Se limpió el ARCHIVO: ${this.rutaArchivo}`)

        } catch (error) {
            throw new Error(`Error al limpiar el ARCHIVO: ${this.rutaArchivo} \n\t Más info: ${error.message}`)
        }
    }

}



const productos = new Contenedor('productos')


console.log('------------- EJEMPLO DE EJECUCION CON USO DE setTimeout\n')

console.log('\n------------- PASO 1: SE AGREGA EL PRIMER PRODUCTO: Laptop\n')


productos.save({
	title: 'Laptop Asus',
	price: 3000,
	thumbnail: 'https://hiraoka.com.pe/media/catalog/product/cache/a357cb11a228eb6f7f15c0ee1ff203af/1/1/119950-1.jpg'
})
	.then(id => console.log(`Objeto guardado con ID: ${id}`))
	.catch(error => console.log(error.message))

setTimeout(() => {
	console.log('\n------------- PASO 2: SE AGREGA EL SEGUNDO PRODUCTO: Teclado\n')
	productos.save({
		title: 'Teclado',
		price: 300,
		thumbnail: 'https://m.media-amazon.com/images/I/61DT+r681TL._AC_SY450_.jpg'
	}).then(id => console.log(`Objeto guardado con ID: ${id}`))
		.catch(error => console.log(error.message))
}, 1000)

setTimeout(() => {
	console.log('\n------------- PASO 3: SE LISTA TODOS LOS PRODUCTOS\n')
	productos.getAll()
		.then(data => console.log(data))
		.catch(error => console.log(error.message))
}, 2000)


setTimeout(() => {
	console.log('\n------------- PASO 4: SE ELIMINAN TODOS LOS PRODUCTOS \n')
	productos.deleteAll()
		.catch(error => console.log(error.message))
}, 3000)

setTimeout(() => {
	console.log('\n------------- PASO 5: SE AGREGA NUEVAMENTE EL PRIMER PRODUCTO: Tv \n')
	productos.save({
		title: 'TV',
		price: 600,
		thumbnail: 'https://i.blogs.es/800731/captura-de-pantalla-2021-06-07-a-las-1.09.46/original.png'
	}).then(id => console.log(`Objeto guardado con ID: ${id}`))
		.catch(error => console.log(error.message))
}, 4000)

setTimeout(() => {
	console.log('\n------------- PASO 6: SE AGREGA NUEVAMENTE EL SEGUNDO PRODUCTO: Peluche panda \n')
	productos.save({
		title: 'Peluche panda',
		price: 100,
		thumbnail: 'https://s3.amazonaws.com/imagenes-sellers-mercado-ripley/2019/06/19154143/P146.jpg'
	}).then(id => console.log(`Objeto guardado con ID: ${id}`))
		.catch(error => console.log(error.message))
}, 5000)

setTimeout(() => {
	console.log('\n------------- PASO 7: SE OBTIENE EL SEGUNDO PRODUCTO: Peluche panda \n')
	productos.getById(2)
		.then(data => console.log(data))
		.catch(error => console.log(error.message))
}, 6000)

setTimeout(() => {
	console.log('\n------------- PASO 8: SE ELIMINA EL SEGUNDO PRODUCTO: Peluche panda \n')
	productos.deleteById(2)
		.catch(error => console.log(error.message))
}, 7000)

setTimeout(() => {
	console.log('\n------------- PASO 9 FINAL: SE LISTA LOS PRODUCTOS RESTANTES \n')
	productos.getAll()
		.then(data => console.log(data))
		.catch(error => console.log(error.message))
}, 8000) 
 
//save(recibe un producto)