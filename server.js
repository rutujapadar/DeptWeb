
// -- Students table
// CREATE TABLE students (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) NOT NULL,
//     roll_number VARCHAR(20) NOT NULL UNIQUE,
//     batch VARCHAR(20) NOT NULL,
//     cgpa DECIMAL(3,2),
//     photo_url VARCHAR(255),
//     created_at TIMESTAMP DEFAULT NOW()
// );

// -- Notices table
// CREATE TABLE notices (
//     id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT NOT NULL,
//     category VARCHAR(50) NOT NULL,
//     date DATE NOT NULL,
//     created_at TIMESTAMP DEFAULT NOW()
// );

// -- Achievements table
// CREATE TABLE achievements (
//     id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT NOT NULL,
//     category VARCHAR(50) NOT NULL,
//     date DATE NOT NULL,
//     icon_class VARCHAR(100),
//     created_at TIMESTAMP DEFAULT NOW()
// );

// -- Comments table
// CREATE TABLE comments (
//     id SERIAL PRIMARY KEY,
//     user_name VARCHAR(100) NOT NULL,
//     user_avatar VARCHAR(255),
//     content TEXT NOT NULL,
//     created_at TIMESTAMP DEFAULT NOW(),
//     likes INT DEFAULT 0,
//     dislikes INT DEFAULT 0
// );

// -- Gallery table
// CREATE TABLE gallery (
//     id SERIAL PRIMARY KEY,
//     image_url VARCHAR(255) NOT NULL,
//     alt_text VARCHAR(255),
//     created_at TIMESTAMP DEFAULT NOW()
// );
import express from 'express';
import { Pool } from 'pg';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import env from "dotenv";
env.config();
// ES Modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || '',
  host: process.env.DB_HOST || '',
  database: process.env.DB_NAME || '',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
  try {
    // Fetch notices
    const noticesResult = await pool.query('SELECT * FROM notices ORDER BY date DESC LIMIT 4');
    
    // Fetch latest achievements (one from each category)
    const achievementsResult = await pool.query(`
      SELECT DISTINCT ON (category) * FROM achievements 
      ORDER BY category, date DESC
    `);
    
    // Fetch gallery images
    const galleryResult = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC LIMIT 4');
    
    res.render('index', {
      notices: noticesResult.rows,
      achievements: achievementsResult.rows,
      gallery: galleryResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/faq', (req, res) => {
  res.render('faq');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// API Endpoints
app.get('/api/students/:batch', async (req, res) => {
  try {
    const { batch } = req.params;
    const result = await pool.query(
      'SELECT * FROM students WHERE batch = $1 ORDER BY name',
      [batch]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/api/notices', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM notices';
    let params = [];
    
    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }
    
    if (search) {
      query += params.length ? ' AND ' : ' WHERE ';
      query += '(title ILIKE $' + (params.length + 1) + ' OR description ILIKE $' + (params.length + 1) + ')';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY date DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/api/achievements/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const result = await pool.query(
      'SELECT * FROM achievements WHERE category = $1 ORDER BY date DESC',
      [category]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/api/comments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Comment submission endpoint
app.post('/api/comments', async (req, res) => {
  try {
    const { user_name, content, user_avatar } = req.body;
    const result = await pool.query(
      'INSERT INTO comments (user_name, content, user_avatar) VALUES ($1, $2, $3) RETURNING *',
      [user_name, content, user_avatar || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});