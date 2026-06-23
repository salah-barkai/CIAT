import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role:    { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
}, { _id: false, timestamps: true });

const conversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  title:     { type: String, default: 'Nouvelle conversation' },
  messages:  [messageSchema],
  lang:      { type: String, default: 'fr' },
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);
