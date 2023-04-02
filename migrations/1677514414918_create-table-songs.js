/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    lagam: {
      type: 'VARCHAR(50)',
    },
    description: {
      type: 'TEXT',
    },
    album_id: {
      type: 'VARCHAR(50)',
      references: 'albums',
      referencesConstraintName: 'fk_songs.album_id:albums.id',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    audio_url: {
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
