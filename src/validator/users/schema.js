const Joi = require('joi');

const PostUserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

const DeleteUserPayloadSchema = Joi.object({
  password: Joi.string().required(),
});

module.exports = { PostUserPayloadSchema, DeleteUserPayloadSchema };
