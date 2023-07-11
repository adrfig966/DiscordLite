const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' }
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;