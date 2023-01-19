const productsRouter = require('express').Router() //creo un router para las rutas de los products
const productsDB = require('../store/productDB')

productsRouter.post('/', validateProduct, postProduct)

function postProduct(req, res) {
  const { error } = req // si en el validateProduct hay un error, lo capturo. 
  if (error && error.length > 0) {
    return res.json({ error })
  } // si no hay ningun error, capturo el obj del formulario(body) 
  const { title, price, thumbnail } = req.body
  productsDB
    .addProduct({ title, price, thumbnail }) // sobreescribe el archivo guardando el objeto pasado en el form
    .then((productID) => res.json({ productID }))
}

// helpers
// Valido que los datos que escriba en el form esten correctos
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

module.exports = productsRouter