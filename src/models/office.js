import pool from './db_connection';
import OfficesModel from '../models/offices';

class OfficeModel extends OfficesModel {
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

  static collateResult(officeId, completionHandler) {
    const queryText = `SELECT officeid, candidateid, COUNT(candidateid) FROM votes WHERE officeId='${officeId}' GROUP BY candidateid, officeid`;
    pool
      .query(queryText)
      .then(res => {
        completionHandler({ successs: true, dataa: res.rows });
      })
      .catch(err => {
        completionHandler({ successs: false, dataa: err });
      });
    return null;
  }
}

export default OfficeModel;
