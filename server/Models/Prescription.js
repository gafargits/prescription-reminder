const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrescriptionModel = new Schema({
  user: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  usageFormular: { type: String, required: false },
  duration: { type: String, required: false },
  send_at: {type: Date, required: false}
});

module.exports = mongoose.model(
  'prescription',
  PrescriptionModel
);
