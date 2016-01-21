import {Schema} from 'mongoose';
import {createdModifiedPlugin} from 'mongoose-createdmodified';
import mongoosePaginate from 'mongoose-paginate';
import extend from 'mongoose-schema-extend'; // eslint-disable-line no-unused-vars

const BaseSchema = new Schema();
BaseSchema.plugin(createdModifiedPlugin, {index: true});
BaseSchema.plugin(mongoosePaginate);

export default BaseSchema;
