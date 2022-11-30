const express = require('express')
const productsRouter = require('./api/controller-products')
const chatRouter = require('./api/controller-chat')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const productsDB = require('./store/productDB')
const chatDB = require('./store/chatDB')

const PORT =8080
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.json())
app.use(express.static('./public'))
app.set('views', './views')
app.set('view engine', 'pug')
app.use('/products', productsRouter)
app.use('/chat', chatRouter)
app.get('/', viewProductPage)

io.on('connection', main)
httpServer.listen(PORT, () => console.log(`servidor escuchando en el  ${PORT}`))

const keys = {
  PRODUCTS: 'PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  CHAT_MESSAGES: 'CHAT_MESSAGES',
  CHAT_ADD_MESSAGE: 'CHAT_ADD_MESSAGE',
}

async function main(socket) {
  console.log('Nuevo cliente')
  try {
    const messages = await chatDB.getAllMessages()
    const products = await productsDB.getAllProducts()
    socket.emit(keys.PRODUCTS, products)
    socket.emit(keys.CHAT_MESSAGES, messages)
    socket.on(keys.ADD_PRODUCT, sendProducts)
    socket.on(keys.CHAT_ADD_MESSAGE, sendMessages)
  } catch (error) {
    console.error(error)
  }
}

function viewProductPage(req, res) {
  res.render('productPage.pug')
}

function sendProducts() {
  productsDB.getAllProducts().then((data) => {
    io.sockets.emit(keys.PRODUCTS, data)
  })
}

function sendMessages() {
  chatDB.getAllMessages().then((data) => {
    io.sockets.emit(keys.CHAT_MESSAGES, data)
  })
}