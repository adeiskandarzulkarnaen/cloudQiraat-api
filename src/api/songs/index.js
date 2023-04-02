/* eslint-disable max-len */

const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { songsService, albumsService, storageService, validator }) => {
    const songsHandler = new SongsHandler(songsService, albumsService, storageService, validator);
    server.route(routes(songsHandler));
  },
};
