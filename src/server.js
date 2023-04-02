/* eslint-disable max-len */

require('dotenv').config();
const config = require('./utils/config');

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

/* Users */
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

/* Login */
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

/* Albums */
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

/* Songss */
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

/* storage */
const StorageService = require('./services/storage/StorageService');

/* cache */

/* exceptions */
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const albumsService = new AlbumsService();
  const albumsStorageService = new StorageService(path.resolve(__dirname, 'api/albums/covers'));
  const songsService = new SongsService();
  const songsStorageService = new StorageService(path.resolve(__dirname, 'api/songs/audios'));
  
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  
  server.ext('onPreResponse', (request, h) => {
    /* mendapatkan konteks response dari request */
    const { response } = request;
    
    if (response instanceof Error) {
      /* penanganan client error secara internal. */
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      
      /* mempertahankan penanganan client error oleh hapi secara native */
      if (!response.isServer) {
        return h.continue;
      }
      
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      console.error(`keterangan: ${response.message}`);
      return newResponse;
    }
    
    /* jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi) */
    return h.continue;
  });
  
  /* registrasi plugin eksternal */
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);
  
  /* mendefinisikan strategy autentikasi jwt */
  server.auth.strategy('cloudQiroat_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
  
  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        usersService,
        authenticationsService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: albums,
      options: {
        albumsService,
        storageService: albumsStorageService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        songsService,
        albumsService,
        storageService: songsStorageService,
        validator: SongsValidator,
      },
    },
  ]);
  
  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
