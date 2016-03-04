import mongoose from 'mongoose';
import BaseSchema from './BaseSchema';

const schema = BaseSchema.extend({
  courseNo: { type: Number },
  lessonNo: { type: Number },
  time: {type: Number },
  audio: { type: String },
  nickname: { type: String },
  serverId: { type: String },
  type: {type: String},
});

export default mongoose.model('Homework', schema);
