import mongoose from 'mongoose';
import BaseSchema from './BaseSchema';

const schema = BaseSchema.extend({
  courseNo: { type: Number},
  lessonNo: { type: Number},
  englishTitle: { type: String},
  chineseTitle: { type: String}
});

export default mongoose.model('PronunciationLesson', schema);
