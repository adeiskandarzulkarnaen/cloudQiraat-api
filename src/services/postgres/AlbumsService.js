const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }
  
  async addAlbum(owner, payload) {
    try {
      const id = `album-${nanoid(16)}`;
      const { name, tags, desc = null, isPublic = false } = payload;
      const coverUrl = null;
      const updatedAt = new Date().toISOString();
      
      const query = {
        text: `INSERT INTO albums VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
          RETURNING id`,
        values: [id, name, tags, desc, owner, isPublic, coverUrl, updatedAt],
      };
      
      const result = await this._pool.query(query);
      return result.rows[0].id;
    } catch {
      throw new InvariantError('Album Gagal ditambahkan');
    }
  }
  
  async getAlbums(credentialId) {
    // TODO : tambahan description jika fitur sudah tersedia
    const query = {
      text: `SELECT id, name, tags, is_public, cover_url 
        FROM albums WHERE is_public=true`,
    };
    
    const result = await this._pool.query(query);
    return result.rows;
  }
  
  async getAlbumById(id) {
    const query = {
      text: `SELECT 
        albums.id,
        albums.name,
        albums.tags,
        albums.description,
        albums.owner,
        albums.is_public,
        albums.cover_url,
        albums.updated_at,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', songs.id, 
              'title', songs.title,
              'lagam', songs.lagam
            ) ORDER BY songs.title ASC
          ) FILTER (WHERE songs.id IS NOT NULL), '[]'
        ) AS songs
        FROM albums
        LEFT JOIN songs ON albums.id = songs.album_id
        WHERE albums.id = $1 
        GROUP BY albums.id`,
      values: [id],
    };
    
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('gagal mendapatkan album, id tidak ditemukan.');
    }
    
    return result.rows[0];
    // const mappedResult = result.rows.map(mapDBToModel);
    // return mappedResult[0];
  }
  
  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM albums WHERE id = $1`,
      values: [id],
    };
    
    await this._pool.query(query);
  }
  
  async editAlbumById(id, payload) {
    const updatedAt = new Date().toISOString();
    const { name, tags, desc, isPublic } = payload;
    
    const query = {
      text: `UPDATE albums 
        SET name=$1, tags=$2, description=$3, is_public=$4, updated_at=$5
        WHERE id=$6`,
      values: [name, tags, desc, isPublic, updatedAt, id],
    };
    
    await this._pool.query(query);
  }
  
  /* album cover */
  async addAlbumCover(id, url) {
    const query = {
      text: 'UPDATE albums SET cover_url=$1 WHERE id=$2',
      values: [url, id],
    };
    
    await this._pool.query(query);
  }
  
  async getAlbumCoverById(id) {
    const query = {
      text: 'SELECT cover_url FROM albums WHERE id=$1',
      values: [id],
    };
    
    const result = await this._pool.query(query);
    // if (!result.rowCount) throw new NotFoundError('album tidak ditemukan');
    return result.rows[0].cover_url;
  }
  
  /* verify */
  async verifyAlbumOwner(albumId, owner) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };
    
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('album tidak ditemukan');
    }
    
    const album = result.rows[0];
    if (album.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }
  
  async verifyAlbumAccess(albumId, userId) {
    try {
      await this.verifyAlbumOwner(albumId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      try {
        // eslint-disable-next-line max-len
        await this._collaborationsService.verifyCollaborator(albumId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = AlbumsService;
