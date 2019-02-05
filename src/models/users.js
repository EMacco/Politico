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
}

export default UsersModel;
