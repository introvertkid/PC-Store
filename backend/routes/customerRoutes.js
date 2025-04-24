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
        message: 'Email already exists!' 
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
      RETURNING customerID, email
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

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful!',
      customer: {
        id: result.rows[0].customerid,
        email: result.rows[0].email
      }
    });
  } catch (error) {
    console.error('Error while registering:\'inscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error while registering:\'inscription. Please try again.' 
    });
  }
});

export default router;