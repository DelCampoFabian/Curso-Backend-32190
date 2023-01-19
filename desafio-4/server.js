// CONSIGNA

/* Realizar un proyecto de servidor basado en node.js y express que ofrezca una API RESTful de productos. En detalle, que incorpore las siguientes rutas:
GET '/api/productos' -> devuelve todos los productos.
GET '/api/productos/:id' -> devuelve un producto según su id.
POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
DELETE '/api/productos/:id' -> elimina un producto según su id.d
 */

const express = require("express")
const app = express()
const routerProducts = require("express").Router() // Creo la ruta de la API
const products = require("./products")

//clase contenedora

class ProductsDB { //Clase contenedora 
    constructor() {
        this.products = products
    }
    //METODOS PARA VER - AGREGAR - EDITAR - ELIMINAR productos  
    getAllProducts() {
        return this.products //Muestra todos los productos 
    }

    getProductById(id) {
        return this.products.find(obj => obj.id === parseInt(id)) // Obtiene el producto que coincida con el ID pasado x parametro
    }

    postProduct({title,price,thumbnail}) { // Recibe el nuevo producto, le agrega un ID y lo pushea al array donde estan los productos
        let newId 
        if(this.products.length === 0){
            newId = 1
        }else{
            newId = this.products[this.products.length - 1].id + 1
        }
        const newProduct = {
            id: newId,
            title,
            price: Number(price),
            thumbnail
        }
        this.products.push(newProduct)
        return newProduct
    }

    putProduct({id,title,price,thumbnail}) { // Busca el Indice donde esta el producto
        const index = this.products.findIndex(product => product.id === parseInt(id))
        if (index < 0) return null
        const updateProduct = { // Lo actualiza 
            id: parseInt(id),
            title,
            price,
            thumbnail
        }
        this.products.splice(index, 1, updateProduct) // Lo reemplaza por el nuevo producto
        return updateProduct
    }

    deleteProducto(id) {
        const index = this.products.findIndex(product => product.id === parseInt(id))
        if (index < 0) return null
        this.products.splice(index, 1)
        return id
    }
}

const productDB = new ProductsDB() // Instancia un nuevo producto [{productos},{productos}] || []

// Lineas para que express entienda que en el body va a recibir JSON
app.use(express.json())
app.use(express.urlencoded({extended: true})) 
// Linea para mostrar los archivos estaticos
app.use(express.static(__dirname + "/public"))
// Linea para instanciar las rutas 
app.use('/api/productos', routerProducts)


//INICIO VERBOS 
routerProducts.get('/', (req, res) => {
    res.json(productDB.getAllProducts())
})

routerProducts.get('/:id', (req, res) => {
    const { id } = req.params
    const product = productDB.getProductById(id)
    if (!product) return res.json({
        error: 'producto no encontrado'
    })
    res.json(product)
})

routerProducts.post('/', validateProduct, (req, res) => {
    const {title,price,thumbnail} = req.body
    const newProduct = productDB.postProduct({
        title,
        price,
        thumbnail
    })
    res.json(newProduct)
})

routerProducts.put('/:id', validateProduct, (req, res) => {
    const { id } = req.params
    const {title,price,thumbnail } = req.body
    const updateProduct = productDB.putProduct({
        id,
        title,
        price,
        thumbnail
    })
    if (!updateProduct) return res.json({
        error: 'producto no encontrado para editar'
    })
    res.send(updateProduct)
})

routerProducts.delete('/:id',(req, res) => {
    const { id } = req.params
    const deletedId = productDB.deleteProducto(id)
    if (!deletedId) return res.json({
        error: 'producto no encontrado para eliminar'
    })
    res.json({
        id
    })
})
//FIN VERBOS 


function validateProduct(req, res, next) {
    const { title,price,thumbnail } = req.body
    if (!title || !price || !thumbnail || !title.trim() || !thumbnail.trim()) return res.json({
        error: 'faltan datos del producto'
    })
    if (isNaN(price)) return res.json({
        error: 'El precio debe ser de tipo numérico'
    })
    if (!thumbnail.includes('http')) return res.json({
        error: 'La URL de la foto debe iniciar con http'
    })
    next()
}


const PORT = 8080
const server = app.listen(PORT, () => {
    console.log("Servidor escuchando en el: " + PORT);
})