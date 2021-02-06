const db = require('../database');
const bcrypt = require('bcryptjs');

function createUser(email, username, password,role) {
  const query = {
    text:`
    INSERT INTO users(email, username, password_hash, role)
    VALUES($1, $2, $3, $4)
    RETURNING id, email, username, role
    `,
    values: [email, username, password, role],
  };
  return db.query(query);
}

function findByUsername(username) {
  const query = {
    text: `
    SELECT * FROM users
    WHERE username = $1
    `,
    values: [username],
  }
  return db.query(query);
}

function generatePasswordHash(plaintextPassword) {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(plaintextPassword, salt, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
}

function verifyPassword(plaintextPassword, passwordHash) {
  return bcrypt.compare(plaintextPassword, passwordHash);
}

module.exports = {
  createUser,
  generatePasswordHash,
  findByUsername,
  verifyPassword,
}