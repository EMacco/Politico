import { Pool } from 'pg';
import { config } from 'dotenv';
import debug from 'debug';

config();

const debugg = debug('drop');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      pool.end();
    })
    .catch(err => {
      debugg(err);
    });
};

const dropOfficesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS offices';
  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      dropUsersTable();
    })
    .catch(err => {
      debugg(err);
    });
};

const dropPartiesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS parties';
  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      dropOfficesTable();
    })
    .catch(err => {
      debugg(err);
    });
};

const dropInterestsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS interests';
  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      dropPartiesTable();
    })
    .catch(err => {
      debugg(err);
    });
};

const dropCandidatesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS candidates';
  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      dropInterestsTable();
    })
    .catch(err => {
      debugg(err);
    });
};

const dropVotesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS votes';
  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      dropCandidatesTable();
    })
    .catch(err => {
      debugg(err);
    });
};

const dropPetitionTable = () => {
  const queryText = 'DROP TABLE IF EXISTS petitions';
  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      dropVotesTable();
    })
    .catch(err => {
      debugg(err);
    });
};

dropPetitionTable();
