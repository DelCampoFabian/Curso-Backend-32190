const { Schema, model } = require(`mongoose`);

const messageSchema = new Schema({
    id: { type: String, required: true },
    author: { type: Object, required: true },
    text: { type: Object, required: true }
}, {
    versionKey: false 
});

module.exports = model(`Messages`, messageSchema);