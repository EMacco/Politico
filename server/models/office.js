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

  static removeInterest(officeId, partyId, candidateId, completionHandler) {
    const queryText = `DELETE FROM interests WHERE candidateid=${candidateId} AND officeid=${officeId} AND partyid=${partyId}`;
    pool
      .query(queryText)
      .then(() => {
        completionHandler();
      })
      .catch(() => {
        completionHandler();
      });
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

  static checkIfPartySlotAvailable(officeId, partyId, completionHandler) {
    const queryText = `SELECT * FROM candidates WHERE officeId=${officeId} AND partyId=${partyId}`;

    pool
      .query(queryText)
      .then(res => {
        completionHandler({ err: false, partyInfo: res.rows });
      })
      .catch(err => {
        completionHandler({ err: true, partyInfo: err });
      });
    return null;
  }

  static fetchVotesByOfficeId(officeId, completionHandler) {
    const queryText = `SELECT * FROM votes WHERE officeid=${officeId}`;

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

  static fetchVotesByVoterId(userId, completionHandler) {
    const queryText = `SELECT * FROM votes WHERE createdby=${userId}`;
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

  static fetchCandidatesByOfficeId(officeId, completionHandler) {
    const queryText = `SELECT * FROM candidates WHERE officeid=${officeId}`;
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

  static setElectionDate(officeId, date, completionHandler) {
    const queryText = `UPDATE candidates SET date='${date}' WHERE officeid=${officeId} RETURNING *`;
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

  static deleteRequest(candidateId, officeId, partyId, completionHandler) {
    const queryText = `DELETE FROM interests WHERE candidateid=${candidateId} AND officeid=${officeId} AND partyid=${partyId} RETURNING *`;
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
