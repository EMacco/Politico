import { Pool } from 'pg';
import { config } from 'dotenv';
import debug from 'debug';

config();

const debugg = debug('index');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const createPetitionTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS petitions(
          id SERIAL PRIMARY KEY, 
          createdOn DATE NOT NULL, 
          createdBy INT NOT NULL, 
          officeId INT NOT NULL REFERENCES offices(id),
          body TEXT NOT NULL
          )`;

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

const createInterestsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS interests(
          id SERIAL PRIMARY KEY, 
          partyId INT NOT NULL REFERENCES parties(id) ON DELETE CASCADE, 
          officeId INT NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
          candidateId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
          )`;

  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      createPetitionTable();
    })
    .catch(err => {
      debugg(err);
    });
};

const createVotesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS votes(
          id SERIAL PRIMARY KEY, 
          createdOn DATE NOT NULL DEFAULT CURRENT_DATE, 
          createdBy INT NOT NULL REFERENCES users(id), 
          officeId INT NOT NULL REFERENCES offices(id),
          candidateId INT NOT NULL REFERENCES users(id)
          )`;

  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      createInterestsTable();
    })
    .catch(err => {
      debugg(err);
    });
};

const createCandidatesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS candidates(
          id SERIAL PRIMARY KEY, 
          officeId INT NOT NULL REFERENCES offices(id) ON DELETE CASCADE,
          partyId INT NOT NULL REFERENCES parties(id) ON DELETE CASCADE, 
          candidateId INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          date DATE NULL
          )`;

  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      createVotesTable();
    })
    .catch(err => {
      debugg(err);
    });
};

const createPartiesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS parties(
          id SERIAL PRIMARY KEY, 
          name VARCHAR(40) NOT NULL, 
          hqAddress VARCHAR(100) NOT NULL, 
          logoUrl TEXT
          )`;

  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      createCandidatesTable();
    })
    .catch(err => {
      debugg(err);
    });
};

const createOfficesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS offices(
            id SERIAL PRIMARY KEY, 
            name VARCHAR(40) NOT NULL, 
            type VARCHAR(40) NOT NULL, 
            logoUrl TEXT
            )`;

  pool
    .query(queryText)
    .then(res => {
      debugg(res);
      createPartiesTable();
    })
    .catch(err => {
      debugg(err);
    });
};

const createUserTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY, 
        firstName VARCHAR(15) NOT NULL, 
        lastName VARCHAR(15) NOT NULL, 
        otherName VARCHAR(15), 
        email VARCHAR(40) UNIQUE NOT NULL, 
        password TEXT NOT NULL,
        phoneNumber VARCHAR(11) NOT NULL,
        passportUrl TEXT,
        isAdmin boolean DEFAULT false,
        partyid INT NULL
        )`;

  pool
    .query(queryText)
    .then(res => {
      debugg(res);

      // Instantiate the initial Admin user
      const createUserQuery = `INSERT INTO users(firstName, lastName, otherName, email, password, phoneNumber, passportUrl, isAdmin) VALUES ('Emmanuel', 'Okwara', 'Nduka', 'emma4real37@gmail.com', '$2b$10$gAeAektVtOq1bdlr.CXHJuGolSV5Sl2/.k6V675/PwXtubcS.Ph/m', '08124185320', 'http://www.google.com/emmanuel-okwara', true)`;
      pool
        .query(createUserQuery)
        .then(() => {
          createOfficesTable();
        })
        .catch(() => {
          // The user has been created before
          createOfficesTable();
        });
    })
    .catch(err => {
      debugg(err);
    });
};

// Create the tables
createUserTable();
