const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const MessageSchema = new Schema({
    text: { type: String, required: true },
    author: { type: String },
    posted: { type: Date, default: Date.now, required: true }
  })

MessageSchema.virtual('date').get(function(){
    return DateTime.fromJSDate(this.posted).toFormat('dd LLL yyyy HH:mm');
})

module.exports = mongoose.model('Message', MessageSchema)