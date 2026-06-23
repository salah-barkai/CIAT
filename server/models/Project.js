import mongoose from 'mongoose';

const bilingualString = { fr: { type: String, default: '' }, en: { type: String, default: '' } };

const projectSchema = new mongoose.Schema({
  title:  bilingualString,
  desc:   bilingualString,
  status: { type: String, default: '' },
  tech:   { type: String, default: '' },
  domain: { type: String, default: '' },
  active: { type: Boolean, default: true },
  order:  { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
