const Joi = require('joi');

const PostAlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  desc: Joi.string(),
  isPublic: Joi.boolean(),
});

const PutAlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  desc: Joi.string().required(),
  isPublic: Joi.boolean().required(),
});

const PostCoverHeadersSchema = Joi.object({
  'content-type': Joi.string()
      // eslint-disable-next-line max-len
      .valid('image/avif', 'image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp')
      .required(),
}).unknown();

module.exports = {
  PostAlbumPayloadSchema,
  PutAlbumPayloadSchema,
  PostCoverHeadersSchema,
};
