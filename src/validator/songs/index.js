const InvariantError = require('../../exceptions/InvariantError');
const {
  PostAudioHeadersSchema,
  PostAudioPayloadSchema,
} = require('./schema');

const SongsValidator = {
  validateAudioHeaders: (payload) => {
    const validationResult = PostAudioHeadersSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  
  validateAudioPayload: (payload) => {
    const validationResult = PostAudioPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
