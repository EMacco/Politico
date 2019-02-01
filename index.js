// Load all necessary modules
import express from 'express';
import bodyparser from 'body-parser';
import debug from 'debug';

// Import my routers
import partiesRoutes from './src/routes/parties';
import officesRoutes from './src/routes/offices';
import usersRoutes from './src/routes/users';

// Instantiate express Module
const app = express();
const debugg = debug('index');

// Add parser middleware to parser json data
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// Use the political parties routes
app.use('/api/v1/parties', partiesRoutes);

// Use the political offices
app.use('/api/v1/offices', officesRoutes);

// Use the users routers
app.use('/api/v1/users', usersRoutes);

// Define the port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  debugg(`Listening at port ${port}`);
});

module.exports = app; // For testing
