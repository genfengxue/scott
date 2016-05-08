import mongoose from 'mongoose';
import BaseSchema from './BaseSchema';

const schema = BaseSchema.extend({
  courseNo: { type: Number },
  lessonNo: { type: Number },
  index: {type: Number },
  type:{type: String},
  description: { type: String },
  audio: { type: String },
  video: { type: String }
});

export default mongoose.model('LessonActivity', schema);
