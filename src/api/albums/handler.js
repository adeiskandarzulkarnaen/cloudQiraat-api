const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumsService, storageService, validator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._validator = validator;
    
    autoBind(this);
  }
  
  async postAlbumHandler({ auth, payload }, h) {
    this._validator.validatePostAlbumPayload(payload);
    const { id: credentialId } = auth.credentials;
    
    const albumId = await this._albumsService.addAlbum(credentialId, payload);
    
    const response = h.response({
      status: 'success',
      message: 'album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }
  
  async getAlbumsHandler({ auth }) {
    const { id: credentialId } = auth.credentials;
    
    const albums = await this._albumsService.getAlbums(credentialId);
    
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }
  
  async getAlbumByIdHandler({ auth, params }) {
    const { id: albumId } = params;
    const { id: credentialId } = auth.credentials;
    
    // TODO : Ganti ke verify playlistAccess jika fitur collab sudah ada
    await this._albumsService.verifyAlbumOwner(albumId, credentialId);
    const album = await this._albumsService.getAlbumById(albumId);
    
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }
  
  async deleteAlbumByIdHandler({ auth, params }) {
    const { id: albumId } = params;
    const { id: credentialId } = auth.credentials;
    
    await this._albumsService.verifyAlbumOwner(albumId, credentialId);
    await this._albumsService.deleteAlbumById(albumId);
    
    return {
      status: 'success',
      message: 'album berhasil dihapus',
      data: {
        albumId,
      },
    };
  }
  
  async putAlbumByIdHandler({ auth, params, payload }) {
    this._validator.validatePutAlbumPayload(payload);
    
    const { id: albumId } = params;
    const { id: credentialId } = auth.credentials;
    
    // TODO: Ganti ke verify playlist access jika sudah ada fitur kolabirasi
    await this._albumsService.verifyAlbumOwner(albumId, credentialId);
    await this._albumsService.editAlbumById(albumId, payload);
    
    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
      data: {
        albumId,
      },
    };
  }
  
  /* album cover */
  
  async postAlbumCoverHandler({ auth, params, payload }, h) {
    const { cover } = payload;
    const { id: albumId } = params;
    const { id: credentialId } = auth.credentials;
    
    this._validator.validateCoverHeaders(cover.hapi.headers);
    
    // TODO: Ganti ke verify playlist access jika sudah ada fitur kolabirasi
    await this._albumsService.verifyAlbumOwner(albumId, credentialId);
    
    const albumCover = await this._albumsService.getAlbumCoverById(albumId);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    
    if (albumCover) await this._storageService.deleteFile(albumCover);
    
    // eslint-disable-next-line max-len
    const url = `http://${process.env.HOST}:${process.env.PORT}/albums/cover/${filename}`;
    await this._albumsService.addAlbumCover(albumId, url);
    
    const response = h.response({
      'status': 'success',
      'message': 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
   
   
  /**
  * BELUM dikerjakan
  *
  * Di sisnya nanti
  */
  
  async postAlbumLikeHandler({ params, auth }, h) {
    const { id: albumId } = params;
    const { userId } = auth.credentials;
    
    await this._albumsService.verifyAlbumAvailability(albumId);
    
    const message = await this._likeService.verifyNewAlbumLike(userId, albumId);
    
    const response = h.response({
      status: 'success',
      message,
    });
    response.code(201);
    return response;
  }
  
  async getNumberOfLikeHandler({ params }, h) {
    const { id } = params;
    
    await this._albumsService.verifyAlbumAvailability(id);
    const { likes, source } = await this._likeService.getAlbumLikeCount(id);
    
    const response = h.response({
      status: 'success',
      data: {
        likes: Number(likes),
      },
    });
    response.header('X-Data-Source', source);
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;
