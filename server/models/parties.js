import pool from './db_connection';

class PartiesModel {
  static fetchAllParties(completionHandler) {
    const queryText = `SELECT * FROM parties`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ success: true, data: res.rows });
      })
      .catch(err => {
        completionHandler({ success: false, data: err });
      });
  }

  static fetchPartyById(partyID, completionHandler) {
    const queryText = `SELECT * FROM parties WHERE id=${partyID}`;

    pool
      .query(queryText)
      .then(res => {
        completionHandler({ success: true, data: res.rows });
      })
      .catch(err => {
        completionHandler({ success: false, data: err });
      });
  }

  static fetchPartyByName(partyName, completionHandler) {
    const queryText = `SELECT * FROM parties WHERE name='${partyName}'`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ success: true, data: res.rows });
      })
      .catch(err => {
        completionHandler({ success: false, data: err });
      });
  }

  static createNewParty({ name, hqAddress, logoUrl }, completionHandler) {
    const queryText = `INSERT INTO parties(name, hqAddress, logoUrl) VALUES('${name}', '${hqAddress}', '${logoUrl}') RETURNING *`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ successs: true, dataa: res.rows });
      })
      .catch(err => {
        completionHandler({ successs: false, dataa: err });
      });
  }

  static updatePartyNameById(id, name, completionHandler) {
    const queryText = `UPDATE parties SET name='${name}' WHERE id=${id} RETURNING *`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ successs: true, dataa: res.rows });
      })
      .catch(err => {
        completionHandler({ successs: false, dataa: err });
      });
  }

  static updatePartyAddressById(id, hqAddress, completionHandler) {
    const queryText = `UPDATE parties SET hqaddress='${hqAddress}' WHERE id=${id} RETURNING *`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ successs: true, dataa: res.rows });
      })
      .catch(err => {
        completionHandler({ successs: false, dataa: err });
      });
  }

  static deletePartyById(id, completionHandler) {
    const queryText = `DELETE FROM parties WHERE id='${id}'`;
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

export default PartiesModel;
