const autoBind = require('auto-bind');

class SongsHandler {
  constructor(songsService, albumsService, storageService, validator) {
    this._songsService = songsService;
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._validator = validator;
    
    autoBind(this);
  }
  
  async postSongHandler({ auth, params, payload }, h) {
    const { id: credentialId } = auth.credentials;
    const { id: albumId } = params;
    const { title, lagam = null, description = null, audio } = payload;
    
    this._validator.validateAudioHeaders(audio.hapi.headers);
    this._validator.validateAudioPayload({
      title, lagam, description, albumId,
    });
    
    // TODO: Ganti ke verify playlist access jika sudah ada fitur kolabirasi
    await this._albumsService.verifyAlbumOwner(albumId, credentialId);
    
    const filename = await this._storageService.writeFile(audio, audio.hapi);
    
    // eslint-disable-next-line max-len
    const audioUrl = `http://${process.env.HOST}:${process.env.PORT}/songs/${filename}`;
    
    await this._songsService.addSong({
      title, lagam, description, albumId, audioUrl,
    });
    
    const response = h.response({
      status: 'success',
      message: 'audio berhasil ditambahkan.',
      data: {
        audioUrl,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = SongsHandler;
