const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
    this._bcryptSaltRounds = 12;
  }
  
  // OKE
  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);
    
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, this._bcryptSaltRounds);
    
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };
    
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan');
    }
    
    return result.rows[0].id;
  }
   
   
  async deleteUser(userId, password) {
    await this.verifyUserPassword(userId, password);
    
    const query = {
      text: `DELETE FROM users WHERE id = $1 RETURNING username`,
      values: [userId],
    };
    
    const result = await this._pool.query(query);
    return result.rows[0].username;
  }
  
  /* verify */
  
  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    
    const result = await this._pool.query(query);
    
    if (result.rowCount) {
      throw new InvariantError('username sudah digunakan.');
    }
  }
  
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthenticationError('credential tidak sesuai');
    }
    
    const { id, password: hashedPassword } = result.rows[0];
    
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError('password tidak sesuai');
    }
    
    return id;
  }
  
  async verifyUserPassword(userId, password) {
    const query = {
      text: 'SELECT password FROM users WHERE id = $1',
      values: [userId],
    };
    console.log(userId);
    
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthenticationError('credentialId tidak sesuai');
    }
    
    const { password: hashedPassword } = result.rows[0];
    
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError('password tidak sesuai');
    }
  }
};

module.exports = UsersService;
