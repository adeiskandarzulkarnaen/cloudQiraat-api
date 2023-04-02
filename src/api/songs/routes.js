const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/songs',
    handler: handler.postSongHandler,
    options: {
      auth: 'cloudQiroat_jwt',
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 12000000, // ± 12 MegaBytes
      },
    },
  },
  // {
  //   method: 'GET',
  //   path: '/albums/{id}/songs',
  //   handler: handler.getSongsByAlbumIdHandler,
  //   options: {
  //     auth: 'cloudQiroat_jwt',
  //   },
  // },
  {
    method: 'GET',
    path: '/songs/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, './audios'),
      },
    },
    options: {
      auth: 'cloudQiroat_jwt',
    },
  },


  // {
  //   method: 'PUT',
  //   path: '/songs/{id}',
  //   handler: handler.putSongByIdHandler,
  //   options: {
  //     auth: 'cloudQiroat_jwt',
  //   },
  // },
  // {
  //   method: 'DELETE',
  //   path: '/songs/{id}',
  //   handler: handler.deleteSongByIdHandler,
  //   options: {
  //     auth: 'cloudQiroat_jwt',
  //   },
  // },
];

module.exports = routes;


module.exports = routes;

