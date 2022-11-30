const chatRouter = require('express').Router()
const chatDB = require('../store/chatDB')

chatRouter.post('/', postMessage)

function postMessage(req, res) {
  const { error } = req
  if (error && error.length > 0) {
    return res.json({ error })
  }
  const { email, message } = req.body
  const newMessage = { email, message, date: Date.now() }
  chatDB.addMessage(newMessage).then((messageID) => res.json({ messageID }))
}


module.exports = chatRouter