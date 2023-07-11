const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;