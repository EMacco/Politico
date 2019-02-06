import pool from './db_connection';

class OfficeModel {
  static registerCandidate(officeId, partyId, candidateId, completionHandler) {
    const queryText = `INSERT INTO candidates(officeId, partyId, candidateId) VALUES('${officeId}', '${partyId}', '${candidateId}') RETURNING *`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ success: true, data: res.rows });
      })
      .catch(err => {
        completionHandler({ success: false, data: err });
      });
    return null;
  }
}

export default OfficeModel;
