import mongoose from 'mongoose';
import BaseSchema from './BaseSchema';

const schema = BaseSchema.extend({
  homeworkName: { type: String },
  courseNo: { type: Number },
  lessonNo: { type: Number },
  time: {type: Number },
  audio: { type: String },
  nickname: { type: String },
  serverId: { type: String },
  serverIds: [String],
});

export default mongoose.model('pronunciationHomework', schema);

