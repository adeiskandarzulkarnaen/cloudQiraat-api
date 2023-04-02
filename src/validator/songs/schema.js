const Joi = require('joi');

const PostAudioHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('audio/mpeg', 'audio/mp4').required(),
}).unknown();


const PostAudioPayloadSchema = Joi.object({
  title: Joi.string().required(),
  lagam: Joi.string(),
  description: Joi.string(),
  albumId: Joi.string().required(),
});


module.exports = {
  PostAudioHeadersSchema,
  PostAudioPayloadSchema,
};
