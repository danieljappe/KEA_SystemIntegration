// app.js
import express from 'express';
import sequelize from './db/db.js';
import User from './models/User.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Sync database models
async function syncDatabase() {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
}

// Basic routes
app.get('/', (req, res) => {
  res.send('API Running');
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  await syncDatabase();
  console.log(`Server running on port ${PORT}`);
});