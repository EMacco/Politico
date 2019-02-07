import pool from './db_connection';

class UsersModel {
  static fetchUserById(userID, completionHandler) {
    const queryText = `SELECT * FROM users WHERE id=${userID}`;

    pool
      .query(queryText)
      .then(res => {
        completionHandler({ success: true, data: res.rows });
      })
      .catch(err => {
        completionHandler({ success: false, data: err });
      });
  }

  static fetchUserByEmail(email, completionHandler) {
    const queryText = `SELECT * FROM users WHERE email='${email}'`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ success: true, data: res.rows });
      })
      .catch(err => {
        completionHandler({ success: false, data: err });
      });
  }

  static createNewUser(
    { firstName, lastName, otherName, email, password, phoneNumber, passportUrl, isAdmin },
    completionHandler
  ) {
    const queryText = `INSERT INTO users(firstName, lastName, otherName, email, password, phoneNumber, passportUrl, isAdmin) VALUES('${firstName}', '${lastName}', '${otherName}', '${email}', '${password}', '${phoneNumber}', '${passportUrl}', '${isAdmin}') RETURNING *`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ successs: true, dataa: res.rows });
      })
      .catch(err => {
        completionHandler({ successs: false, dataa: err });
      });
  }

  static deleteUserById(id, completionHandler) {
    const queryText = `DELETE FROM users WHERE id='${id}'`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ successs: true, dataa: res.rows });
      })
      .catch(err => {
        completionHandler({ successs: false, dataa: err });
      });
  }
}

export default UsersModel;
