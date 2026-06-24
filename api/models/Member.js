import mongoose from 'mongoose';

const bilingualString = { fr: { type: String, default: '' }, en: { type: String, default: '' } };

const memberSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  order:      { type: Number, default: 0 },
  role:       bilingualString,
  profession: { type: String, default: '' },
  age:        { type: Number },
  bio:        bilingualString,
  photo:      { type: String, default: '' },
  active:     { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Member', memberSchema);
