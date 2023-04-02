const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'DELETE',
    path: '/users',
    handler: handler.deleteUserHandler,
    options: {
      auth: 'cloudQiroat_jwt',
    },
  },
];

module.exports = routes;
