const { Schema, model } = require('mongoose');

const schema = new Schema({
  room: { type: String, required: true },
  name: { type: String, required: true },
  message: {type: String}
})

module.exports = model('Room', schema)