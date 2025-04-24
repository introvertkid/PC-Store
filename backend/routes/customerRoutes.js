import express from 'express';
import bcrypt from 'bcrypt';
import db from '../database/dbConnection.js';

const router = express.Router();

const generateCustomerId = async () => {
  const result = await db.query('SELECT MAX(customerID) FROM customers');
  const maxId = result.rows[0].max || 0;
  return maxId + 1;
};

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    const checkEmail = await db.query('SELECT email FROM customers WHERE email = $1', [email]);
    if (checkEmail.rowCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already in use.' 
      });
    }

    const customerId = await generateCustomerId();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const customerName = `${firstName} ${lastName}`;
    
    const insertQuery = `
      INSERT INTO customers (
        customerID, 
        customerName, 
        customerLastName, 
        customerFirstName, 
        userPassword, 
        email, 
        phoneNumber
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING customerID, email, customerName
    `;

    const values = [
      customerId,
      customerName,
      lastName,
      firstName,
      hashedPassword,
      email,
      phoneNumber
    ];

    const result = await db.query(insertQuery, values);
    
    console.log(`SIGNUP SUCCESSFUL: ${result.rows[0].customername} (${result.rows[0].email}) has registered successfully!`);

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful!',
      customer: {
        id: result.rows[0].customerid,
        name: result.rows[0].customername,
        email: result.rows[0].email
      }
    });
  } catch (error) {
    console.error('Error during\'inscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during\'inscription. Please try again.' 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userQuery = `
      SELECT 
        customerID, 
        customerName, 
        customerFirstName, 
        customerLastName, 
        email, 
        userPassword, 
        phoneNumber 
      FROM customers 
      WHERE email = $1
    `;
    
    const result = await db.query(userQuery, [email]);
    
    if (result.rowCount === 0) {
      console.log(`LOGIN FAILURE: Login attempt with non-existent email: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password.'
      });
    }

    const user = result.rows[0];
    
    const isPasswordValid = await bcrypt.compare(password, user.userpassword);
    
    if (!isPasswordValid) {
      console.log(`LOGIN FAILURE: Incorrect password for: ${user.customername} (${email})`);
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password.'
      });
    }

    delete user.userpassword;

    console.log(`LOGIN SUCCESSFUL: ${user.customername} (${email}) logged in successfully!`);

    res.status(200).json({
      success: true,
      message: 'Connection successful!',
      customer: {
        id: user.customerid,
        name: user.customername,
        firstName: user.customerfirstname,
        lastName: user.customerlastname,
        email: user.email,
        phoneNumber: user.phonenumber
      }
    });
    
  } catch (error) {
    console.error('Error while connecting:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in. Please try again.'
    });
  }
});

export default router;