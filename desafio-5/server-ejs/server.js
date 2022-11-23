const express = require("express")
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



app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', viewProductList)
app.get('/crearProducto', viewCreateProduct)
app.post('/product', validateProduct, postProduct)


function viewProductList(req, res) {
  const products = productDB.getAllProducts()
  res.render('productList.ejs', { products })
}

function viewCreateProduct(req, res) {
  const { error, title, price, thumbnail } = req.query
  return res.render('productForm.ejs', { error, title, price, thumbnail })
}

function postProduct(req, res) {
  const { error } = req
  if (error && error.length > 0) {
    return res.redirect(
      `/crearProducto/?error=${error}&title=${req.title}&price=${req.price}&thumbnail=${req.thumbnail}`
    )
  }
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



const PORT = 8080
const server = app.listen(PORT, () => {
    console.log("Servidor escuchando en el: " + PORT);
})