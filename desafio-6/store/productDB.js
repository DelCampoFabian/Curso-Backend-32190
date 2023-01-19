const Contenedor = require('./contenedor')
//ProductDB tiene:
/* 
- funcion getAllProducts que crea un nuevo contender llamado products y muestra todos los datos de ese archivo
- funcion addProduct que recibe por parametro los key de un producto, crea un nuevo archivo, un nuevo producto con los valores obtenidos por parametro y lo guarda en el archivo

*/


function getAllProducts() {
  const productsDB = new Contenedor('products')
  return productsDB.getAll()
}

function addProduct({ title, price, thumbnail }) {
  const productsDB = new Contenedor('products')
  const newProduct = { title, price, thumbnail }
  return productsDB.save(newProduct)
}

module.exports = {
  getAllProducts,
  addProduct,
}