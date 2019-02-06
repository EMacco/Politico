import UsersModel from '../models/users';
import { validateUser } from './validationFunctions';

class UsersController {
  static fetchSpecificUser(req, res) {
    UsersModel.fetchUserById(parseInt(req.params.id, 10), ({ success, data }) => {
      // Check if the query was successful
      if (success) {
        // Check if the office exists

        if (data.length === 0)
          return res.status(404).json({ status: 404, error: 'The user does not exist' });

        // The user exists return to the user
        return res.status(200).json({ status: 200, data: [data] });
      }

      // It is a server error
      return res.json({ status: 500, error: data });
    });
  }

  static createUsers(req, res) {
    // Validate the party details
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });
    // Check if the user exists before
    UsersModel.fetchUserByEmail(req.body.email, ({ success, data }) => {
      if (!success) {
        // It is a server error
        return res.status(500).json({ status: 500, error: data });
      }

      // Check if the user exists
      if (data.length !== 0)
        // The user already exists
        return res.status(409).json({ status: 409, error: 'This user already exists' });

      // Create the new user
      let adminVal = false;
      if (req.body.isAdmin !== undefined) {
        adminVal = req.body.isAdmin;
      }

      const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        otherName: req.body.otherName,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        passportUrl: req.body.passportUrl,
        isAdmin: adminVal
      };

      //   Insert the new user in the array
      UsersModel.createNewUser(newUser, ({ successs, dataa }) => {
        if (successs) {
          // Return the new user details to the user
          return res.status(201).json({ status: 201, data: dataa });
        }
        return res.status(500).json({ status: 500, error: dataa });
      });
    });
  }

  static deleteUser(req, res) {
    // Check if the user exists
    UsersModel.fetchUserById(parseInt(req.params.id, 10), ({ success, data }) => {
      if (!success) {
        // It is a server error
        return res.status(500).json({ status: 500, error: data });
      }

      // Check if the user exists
      if (data.length === 0) {
        return res.status(404).json({ status: 404, error: 'User does not exist' });
      }

      // Delete from server
      UsersModel.deleteUserById(parseInt(req.params.id, 10), ({ successs }) => {
        if (!successs) {
          return res.status(500).json({ status: 500, error: data });
        }

        return res.status(200).json({ status: 200, data });
      });
    });
  }
}

export default UsersController;
