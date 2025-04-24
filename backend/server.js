import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import customerRoutes from './routes/customerRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'database/dbConfig.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/customers', customerRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('API works correctly');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});