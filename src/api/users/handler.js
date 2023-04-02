const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    
    autoBind(this);
  }
  
  async postUserHandler({ payload }, h) {
    this._validator.validatePostUserPayload(payload);
    
    const userId = await this._service.addUser(payload);
    
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
  
  async deleteUserHandler({ payload, auth }) {
    this._validator.validateDeleteUserPayload(payload);
    const { password } = payload;
    const { id: credentialId } = auth.credentials;
    
    const username = await this._service.deleteUser(credentialId, password);
    
    return {
      status: 'success',
      message: 'User berhasil dihapus',
      data: {
        username,
      },
    };
  }
};

module.exports = UsersHandler;
