import pool from './db_connection';

class OfficesModel {
  static fetchAllOffices(completionHandler) {
    const queryText = `SELECT * FROM offices`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ success: true, data: res.rows });
      })
      .catch(err => {
        completionHandler({ success: false, data: err });
      });
  }

  static fetchOfficeById(officeID, completionHandler) {
    const queryText = `SELECT * FROM offices WHERE id=${officeID}`;

    pool
      .query(queryText)
      .then(res => {
        completionHandler({ success: true, data: res.rows });
      })
      .catch(err => {
        completionHandler({ success: false, data: err });
      });
  }

  static fetchOfficeByNameAndType(officeName, officeType, completionHandler) {
    const queryText = `SELECT * FROM offices WHERE name='${officeName}' AND type='${officeType}'`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ success: true, data: res.rows });
      })
      .catch(err => {
        completionHandler({ success: false, data: err });
      });
  }

  static createNewOffice({ name, type, logoUrl }, completionHandler) {
    const queryText = `INSERT INTO offices(name, type, logoUrl) VALUES('${name}', '${type}', '${logoUrl}') RETURNING *`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ successs: true, dataa: res.rows });
      })
      .catch(err => {
        completionHandler({ successs: false, dataa: err });
      });
  }

  static updateOfficeNameById(id, name, completionHandler) {
    const queryText = `UPDATE offices SET name='${name}' WHERE id=${id} RETURNING *`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ successs: true, dataa: res.rows });
      })
      .catch(err => {
        completionHandler({ successs: false, dataa: err });
      });
  }

  static deleteOfficeById(id, completionHandler) {
    const queryText = `DELETE FROM offices WHERE id='${id}'`;
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

export default OfficesModel;
