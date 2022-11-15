const express = require("express")
const app = express()
const routerProducts = require("express").Router()
const products = require("./products")

//clase contenedora

class ProductsDB {
    constructor() {
        this.products = products
        
    }

    getAllProducts() {
        return this.products
    }

    getProductById(id) {
        return this.products.find(obj => obj.id === parseInt(id))
    }

    postProduct({title,price,thumbnail}) {

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

    putProduct({id,title,price,thumbnail}) {
        const index = this.products.findIndex(product => product.id === parseInt(id))
        if (index < 0) return null
        const updateProduct = {
            id: parseInt(id),
            title,
            price,
            thumbnail
        }
        this.products.splice(index, 1, updateProduct)
        return updateProduct
    }

    deleteProducto(id) {
        const index = this.products.findIndex(product => product.id === parseInt(id))
        if (index < 0) return null
        this.products.splice(index, 1)
        return id
    }
}

const productDB = new ProductsDB()


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use('/api/productos', routerProducts)



routerProducts.get('/', getAllProducts)
routerProducts.get('/:id', getProductById)
routerProducts.post('/', validateProduct, postProduct)
routerProducts.put('/:id', validateProduct, putProduct)
routerProducts.delete('/:id', deleteProduct)

function getAllProducts(req, res) {
    res.json(productDB.getAllProducts())
}

function getProductById(req, res) {
    const { id } = req.params
    const product = productDB.getProductById(id)
    if (!product) return res.json({
        error: 'producto no encontrado'
    })
    res.json(product)
}

function postProduct(req, res) {
    const {title,price,thumbnail} = req.body
    const newProduct = productDB.postProduct({
        title,
        price,
        thumbnail
    })
    res.json(newProduct)
}

function putProduct(req, res) {
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
}

function deleteProduct(req, res) {
    const { id } = req.params
    const deletedId = productDB.deleteProducto(id)
    if (!deletedId) return res.json({
        error: 'producto no encontrado para eliminar'
    })
    res.json({
        id
    })
}

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