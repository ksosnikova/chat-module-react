const { Schema, model } = require('mongoose');

const schema = new Schema({
  room: { type: String, required: true },
  message: {
    name: String,
    text: String,
    date: Date
  }
});

module.exports = model('RoomIndividual', schema);