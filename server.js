const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

const app = express();
app.use(bodyParser.json());

// File path to store the data (JSON format)
const dataFilePath = path.join(__dirname, 'data.json');
const usersFilePath = path.join(__dirname, 'users.json'); // File to store user data

// Check if the users file exists, if not, create it with a sample user
if (!fs.existsSync(usersFilePath)) {
  const sampleUser = {
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10), // hashed password
  };
  fs.writeFileSync(usersFilePath, JSON.stringify([sampleUser], null, 2));
}

// Check if data file exists, if not, create it
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([])); // Initialize with empty array
}

// Helper function to read data from the file
const readData = () => {
  const rawData = fs.readFileSync(dataFilePath);
  return JSON.parse(rawData);
};

// Helper function to write data to the file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Helper function to read users from the file
const readUsers = () => {
  const rawUsers = fs.readFileSync(usersFilePath);
  return JSON.parse(rawUsers);
};

// Middleware to check if a user is authenticated
const authenticate = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Compare the provided password with the hashed password
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  next(); // Proceed to the next middleware or route handler
};

// Endpoint to register a new user (only once for testing)
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const users = readUsers();
  const existingUser = users.find(u => u.username === username);

  if (existingUser) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
  const newUser = { username, password: hashedPassword };
  users.push(newUser);

  // Save the new user to the file
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.status(200).json({ message: 'User registered successfully' });
});

// Endpoint to log in
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.status(200).json({ message: 'Login successful' });
});

// Endpoint to add new data (protected route)
app.post('/add-data', authenticate, (req, res) => {
  const newData = req.body; // New data to add

  try {
    const currentData = readData(); // Get current data
    currentData.push(newData); // Append new data

    writeData(currentData); // Save updated data to the file

    res.status(200).json({ message: 'Data added successfully', newData });
  } catch (error) {
    res.status(500).json({ error: 'Error saving data', details: error.message });
  }
});

// Endpoint to get all stored data (protected route)
app.get('/get-data', authenticate, (req, res) => {
  try {
    const currentData = readData(); // Get current data
    res.status(200).json({ data: currentData });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
});

// Endpoint to clear all data (protected route)
app.delete('/clear-data', authenticate, (req, res) => {
  try {
    writeData([]); // Clear data by writing an empty array
    res.status(200).json({ message: 'All data cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error clearing data', details: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})