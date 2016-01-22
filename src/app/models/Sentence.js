import mongoose from 'mongoose';
import BaseSchema from './BaseSchema';

const schema = BaseSchema.extend({
  courseNo: { type: Number },
  lessonNo: { type: Number },
  sentenceNo: {type: Number },
  english: { type: String },
  chinese: { type: String },
  audios: [String],
});

export default mongoose.model('Sentence', schema);
