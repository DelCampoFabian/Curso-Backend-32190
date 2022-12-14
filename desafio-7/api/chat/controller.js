const chatRouter = require('express').Router()
const model = require('./model')

chatRouter.post('/', postMessage)

function postMessage(req, res) {
  const { error } = req
  if (error && error.length > 0) {
    return res.json({ error })
  }
  const { email, message } = req.body
  const newMessage = { email, message }
  model.addMessage(newMessage).then((messageID) => res.json({ messageID }))
}





module.exports = chatRouter