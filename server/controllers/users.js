import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import UsersModel from '../models/users';
import { validateUserLogin, validateUser } from './validationFunctions';
import Authorization from './authorization';

class UsersController {
  static fetchSpecificUser(req, res) {
    UsersModel.fetchUserById(parseInt(req.params.id, 10), ({ success, data }) => {
      // Check if the query was successful
      if (success) {
        // Check if the office exists

        if (data.length === 0)
          return res.status(404).json({ status: 404, error: 'The user does not exist' });

        // The user exists return to the user
        return res.status(200).json({ status: 200, data });
      }

      // It is a server error
      return res.status(500).json({ status: 500, error: data });
    });
  }

  static createUsers(req, res) {
    try {
      if (req.body.email) {
        req.body.email = req.body.email
          .replace(/\s\s+/g, ' ')
          .trim()
          .toLowerCase();
      }

      // Remove white spaces
      if (req.body.password) {
        req.body.password = req.body.password.replace(/\s\s+/g, ' ').trim();
      }

      // Remove white spaces
      if (req.body.firstName) {
        req.body.firstName = req.body.firstName.replace(/\s\s+/g, ' ').trim();
      }

      // Remove white spaces
      if (req.body.lastName) {
        req.body.lastName = req.body.lastName.replace(/\s\s+/g, ' ').trim();
      }
    } catch (error) {}

    // Validate the user details
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

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
      let isAdmin = false;
      if (req.body.isAdmin) {
        isAdmin = true;
      }

      // Hash the password
      const salt = 10;
      bcrypt.hash(req.body.password, salt, (_, result) => {
        const newUser = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          otherName: req.body.otherName,
          email: req.body.email,
          password: result,
          phoneNumber: req.body.phoneNumber,
          passportUrl: req.body.passportUrl,
          isAdmin
        };

        //   Insert the new user in the array
        UsersModel.createNewUser(newUser, ({ successs, dataa }) => {
          if (successs) {
            const token = jwt.sign({ data: dataa[0] }, process.env.TOKEN_KEY, {
              expiresIn: 60 * 60
            });
            // Return the new user details to the user
            return res.status(201).json({ status: 201, data: [{ token, user: dataa[0] }] });
          }
          return res.status(500).json({ status: 500, error: dataa });
        });
      });
      return null;
    });
    return null;
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
      return null;
    });
  }

  static loginUser(req, res) {
    try {
      if (req.body.email) {
        req.body.email = req.body.email
          .replace(/\s\s+/g, ' ')
          .trim()
          .toLowerCase();
      }

      // Remove white spaces
      if (req.body.password) {
        req.body.password = req.body.password.replace(/\s\s+/g, ' ').trim();
      }
    } catch (error) {}

    // Validate the user details
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

    // Check if the user exists before
    UsersModel.fetchUserByEmail(req.body.email, ({ success, data }) => {
      if (!success) {
        // It is a server error
        return res.status(500).json({ status: 500, error: data });
      }

      // Check if the user exists
      if (data.length === 0) {
        // The login details are incorrect
        return res.status(401).json({ status: 401, error: 'Invalid Email or Password!' });
      }
      bcrypt.compare(req.body.password, data[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({ status: 401, error: 'Invalid Email or Password!' });
        }

        // Generate token for the user
        const token = jwt.sign({ data: data[0] }, process.env.TOKEN_KEY, { expiresIn: 60 * 60 });

        // The login details are correct
        return res.status(200).json({ status: 200, data: [{ token, user: data[0] }] });
      });
      return null;
    });
    return null;
  }

  static updateUserProfilePicture(req, res) {
    Authorization.getUserDetails(req, res, userDetails => {
      try {
        if (req.body.imageUrl) {
          req.body.imageUrl = req.body.imageUrl
            .replace(/\s\s+/g, ' ')
            .trim()
            .toLowerCase();
        }
      } catch (error) {}

      const details = {
        imageUrl: req.body.imageUrl,
        userId: userDetails.id
      };
      const schema = {
        userId: Joi.number()
          .required()
          .label('Please enter user ID as a number'),
        imageUrl: Joi.string()
          .required()
          .uri()
          .label('Please enter a valid image URL')
      };

      const { error } = Joi.validate(details, schema);
      if (error)
        return res.status(400).json({ status: 400, error: error.details[0].context.label });

      // Check if the user exists
      UsersModel.fetchUserById(parseInt(details.userId, 10), ({ success, data }) => {
        if (!success) {
          // It is a server error
          return res.status(500).json({ status: 500, error: data });
        }

        // Check if the user exists
        if (data.length === 0)
          // The user does not exist
          return res.status(404).json({ status: 404, error: 'The user does not exist' });

        // Update the profile picture
        UsersModel.updateProfilePicture(
          parseInt(details.userId, 10),
          details.imageUrl,
          updateRes => {
            if (!updateRes.success) {
              return res.status(500).json({ status: 500, error: updateRes.data });
            }

            // Successuful
            return res.status(200).json({ status: 200, data: [updateRes.data[0]] });
          }
        );
        return null;
      });
      return null;
    });
  }
}

export default UsersController;
