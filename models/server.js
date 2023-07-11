const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  type: { type: String, enum: ['public', 'private'], default: 'public' },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Server = mongoose.model('Server', serverSchema);

module.exports = Server;