import pool from './db_connection';

class VotesModel {
  static registerVote(createdBy, officeId, candidateId, completionHandler) {
    const queryText = `INSERT INTO votes(createdBy, officeId, candidateId) VALUES('${createdBy}', '${officeId}', '${candidateId}') RETURNING *`;
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

  static checkIfVotedBefore(createdBy, officeId, completionHandler) {
    const queryText = `SELECT * FROM votes WHERE createdBy='${createdBy}' AND officeId='${officeId}'`;
    pool
      .query(queryText)
      .then(res => {
        if (res.rows.length === 0) {
          completionHandler(false, false);
        } else {
          completionHandler(false, true);
        }
      })
      .catch(() => {
        completionHandler(true, true);
      });
    return null;
  }

  static checkIfActiveElection(candidateId, officeId, completionHandler) {
    const queryText = `SELECT * FROM candidates WHERE candidateId='${candidateId}' AND officeId='${officeId}'`;
    pool
      .query(queryText)
      .then(res => {
        if (res.rows.length === 0) {
          completionHandler(false, false);
        } else {
          completionHandler(false, true);
        }
      })
      .catch(() => {
        completionHandler(true, true);
      });
    return null;
  }
}

export default VotesModel;
