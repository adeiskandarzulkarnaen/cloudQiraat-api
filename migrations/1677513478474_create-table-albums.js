/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    tags: {
      type: 'TEXT[]',
      notNull: true,
    },
    description: {
      type: 'TEXT',
    },
    owner: {
      type: 'VARCHAR(50)',
      references: 'users',
      referencesConstraintName: 'fk_albums.owner:users.id',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    is_public: {
      type: 'BOOLEAN',
    },
    cover_url: {
      type: 'TEXT',
    },
    updated_at: {
      type: 'VARCHAR(50)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
