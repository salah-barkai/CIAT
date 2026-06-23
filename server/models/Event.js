import mongoose from 'mongoose';

const bilingualString = { fr: { type: String, default: '' }, en: { type: String, default: '' } };

const eventSchema = new mongoose.Schema({
  date:     bilingualString,
  title:    bilingualString,
  desc:     bilingualString,
  tag:      bilingualString,
  location: { type: String, default: "N'Djamena" },
  status:   { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
