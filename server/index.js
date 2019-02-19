// Load all necessary modules
import express from 'express';
import bodyparser from 'body-parser';
import debug from 'debug';
import cors from 'cors';
import { config } from 'dotenv';

// Import my routers
import partiesRoutes from './routes/parties';
import officesRoutes from './routes/offices';
import officeRoutes from './routes/office';
import usersRoutes from './routes/users';
import authRoutes from './routes/auth';
import votesRoutes from './routes/votes';

// Configure the environment
config();

// Instantiate express Module
const app = express();
const debugg = debug('index');

// Add parser middleware to parser json data
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

// Use the political parties routes
app.use('/api/v1/parties', partiesRoutes);

// Use the political offices
app.use('/api/v1/offices', officesRoutes);

// Use the users routers
app.use('/api/v1/users', usersRoutes);

// Use the users auth
app.use('/api/v1/auth', authRoutes);

// Use the office
app.use('/api/v1/office', officeRoutes);

// Use the votes
app.use('/api/v1/votes', votesRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 404, error: 'Page not found!' });
});

// Define the port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  debugg(`Listening at port ${port}`);
});

module.exports = app; // For testing
