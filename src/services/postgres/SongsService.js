const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }
  
  async addSong(payload) {
    const id = `songs-${nanoid(16)}`;
    
    const query = {
      text: `INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [id, ...Object.values(payload)],
    };
    
    const result = await this._pool.query(query);
    if (!result.rowCount) throw new InvariantError('Lagu Gagal ditambahkan');
    return result.rows[0].id;
  }
}

module.exports = SongsService;
