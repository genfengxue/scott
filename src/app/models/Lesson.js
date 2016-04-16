import mongoose from 'mongoose';
import BaseSchema from './BaseSchema';

const schema = BaseSchema.extend({
  courseNo: { type: Number},
  lessonNo: { type: Number},
  englishTitle: { type: String},
  chineseTitle: { type: String},
  hasListen: { type: Boolean},
  hasTranslate: { type: Boolean},
  videoPath: { type: String},
  publishedDate: { type: Date},
});

export default mongoose.model('Lesson', schema);
