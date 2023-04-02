const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler,
    options: {
      auth: 'cloudQiroat_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums',
    handler: handler.getAlbumsHandler,
    options: {
      auth: 'cloudQiroat_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumByIdHandler,
    options: {
      auth: 'cloudQiroat_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumByIdHandler,
    options: {
      auth: 'cloudQiroat_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumByIdHandler,
    options: {
      auth: 'cloudQiroat_jwt',
    },
  },
  
  /* album cover */
  {
    method: 'POST',
    path: '/albums/{id}/cover',
    handler: handler.postAlbumCoverHandler,
    options: {
      auth: 'cloudQiroat_jwt',
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000, // 512kb
      },
    },
  },
  {
    method: 'GET',
    path: '/albums/cover/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, './covers'),
      },
    },
    options: {
      auth: 'cloudQiroat_jwt',
    },
  },

  // {
  //   method: 'GET',
  //   path: '/albums/covers/{param*}',
  //   handler: {
  //     directory: {
  //       path: path.resolve(__dirname, './covers'),
  //     },
  //   },
  // },

  /* next fiture */
  // {
  //   method: 'POST',
  //   path: '/albums/{id}/likes',
  //   handler: handler.postAlbumLikeHandler,
  //   options: {
  //     auth: 'openmusic_jwt',
  //   },
  // },
  // {
  //   method: 'GET',
  //   path: '/albums/{id}/likes',
  //   handler: handler.getNumberOfLikeHandler,
  // },
];

module.exports = routes;
