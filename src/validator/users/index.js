const { PostUserPayloadSchema, DeleteUserPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const UserValidator = {
  validatePostUserPayload: (payload) => {
    const validationResult = PostUserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  
  validateDeleteUserPayload: (payload) => {
    const validationResult = DeleteUserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UserValidator;
