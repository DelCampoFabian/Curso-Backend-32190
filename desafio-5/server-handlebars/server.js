//Consigna:

/*  Utilizando la misma API de productos del proyecto entregable de la clase anterior, construir un web server que incorpore:
Un formulario de carga de productos en la ruta raíz (configurar la ruta '/productos' para recibir el POST, y redirigir al mismo formulario).
Una vista de los productos cargados (utilizando plantillas de handlebars) en la ruta GET '/productos'.
Ambas páginas contarán con un botón que redirija a la otra.
 */ 


const express = require("express")
const handlebars = require('express-handlebars')

const app = express()

//clase contenedora

class ProductsDB {
    constructor() {
        this.products = []
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

const PORT = 8080

app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine()) //LLamo mi motor de plantillas
app.set('view engine', 'handlebars') //LLamo mi motor de plantillas
app.set('views', './views') //LLamo mi motor de plantillas

app.get('/', viewProductList)
app.get('/crearProducto', viewCreateProduct)
app.post('/product', validateProduct , postProduct)


function viewProductList(req, res) {
  const products = productDB.getAllProducts()
  res.render('productList', { products }) //Le mando a productList.hbs todos los productos
}

function viewCreateProduct(req, res) {
  const { error, title, price, thumbnail } = req.query // Recibo los errores x query
  return res.render('productForm', { error, title, price, thumbnail }) // Le mando el post 
}

function postProduct(req, res) {
  const { error } = req // Si hay un error lo voy a capturar
  if (error && error.length > 0) {
    return res.redirect( // Voy a redirigir hacia una ruta crearProducto y le voy a mandar x query la informacion del producto para que muestre el mje de error
      `/crearProducto/?error=${error}&title=${req.title}&price=${req.price}&thumbnail=${req.thumbnail}`
    )
  }//Si no hay error hago el post correspondiente
  const { title, price, thumbnail } = req.body
  productDB.postProduct({ title, price, thumbnail })
  return res.redirect('/')
}

// helpers
function validateProduct(req, res, next) {
  const { title, price, thumbnail } = req.body
  if (!title || !price || !thumbnail || !title.trim() || !thumbnail.trim()) {
    req.error = 'faltan datos del producto'
  } else if (isNaN(price)) {
    req.error = 'El precio debe ser de tipo numérico'
  } else if (!thumbnail.includes('http')) {
    req.error = 'La URL de la foto debe iniciar con http'
  }
  req.title = title
  req.price = price
  req.thumbnail = thumbnail
  next()
} 

app.listen(PORT, () => console.log("Escuchando en el 8080"))