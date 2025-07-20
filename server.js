import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
import cors from "cors";  // <--- Added CORS support

import mongoose from "mongoose";
import Calendar from "./models/Calendar.js";
import Curriculum from "./models/Curriculum.js";
import AcademicResult from "./models/Result.js";
import Event from "./models/Event.js";
import Timetable from "./models/Timetable.js";

const port = 3000;
const app = express();
env.config();

// CORS setup for React frontend (adjust port if different)
app.use(cors({
    origin: "http://localhost:3001", 
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // <--- Important for React JSON requests
// app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to PostgreSQL
// const db = new pg.Client({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DB,
//     password: process.env.DB_PASS,
//     port: process.env.DB_PORT
// });
// db.connect();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected to 'test' database");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Middleware to check if user is logged in
app.use((req, res, next) => {
    res.locals.user = req.isAuthenticated() ? req.user : null;
    next();
});

// --- Routes ---

app.get("/", (req, res) => {
    res.json({ message: "Welcome to API", user: req.user || null });
});

app.get("/about", (req, res) => {
    res.json({ message: "About Page", year: new Date().getFullYear() });
});

app.get("/branch", (req, res) => {
    res.json({ message: "Branch Page", year: new Date().getFullYear() });
});

app.get("/faq", (req, res) => {
    res.json({ message: "FAQ Page", year: new Date().getFullYear() });
});

app.get("/student", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ message: "Student Data Page", user: req.user });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
});

// app.get("/Calendar", async (req, res) => {
//   try {
//     const calendars = await Calendar.find();
//     res.json(calendars);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch calendar data" });
//   }
// });


app.get("/Calendar", async (req, res) => {
  try {
    const calendars = await Calendar.find();

    const updated = calendars.map(item => ({
      ...item.toObject(),
      pdfUrl: `http://localhost:3000/${item.pdfFile.path}`
    }));

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch calendar data" });
  }
});


app.get("/Curriculum", async (req, res) => {
  try {
    const curriculum = await Curriculum.find();

    const updated = curriculum.map(item => ({
      ...item.toObject(),
      pdfUrl: `http://localhost:3000/${item.pdfFile.path}`
    }));

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch curriculum data" });
  }
});

app.get("/results", async (req, res) => {
  try {
    const results = await AcademicResult.find();
    res.json(results);
  } catch (err) {
    console.error("Error fetching academic results:", err);
    res.status(500).json({ error: "Failed to fetch academic results" });
  }
});


app.get("/events", async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: -1 }); 
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});


app.get("/timetables", async (req, res) => {
  try {
    const timetables = await Timetable.find();
     const updated = timetables.map(item => ({
      ...item.toObject(),
      pdfUrl: item.pdfFile?.path ? `http://localhost:3000/${item.pdfFile.path}` : ''
    }));

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch timetables" });
  }
});

app.post("/login",
    passport.authenticate("local"),
    (req, res) => {
        res.json({ message: "Login successful", user: req.user });
    }
);

app.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error logging out" });
        }
        res.json({ message: "Logged out successfully" });
    });
});

// --- Passport Setup ---
passport.use(
    new Strategy(async function verify(username, password, cb) {
        try {
            const result = await db.query("SELECT * FROM logindetails WHERE email = $1", [username]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const storedPass = user.password;

                bcrypt.compare(password, storedPass, (err, valid) => {
                    if (err) {
                        console.log("Error comparing passwords:", err);
                        return cb(err);
                    } else {
                        if (valid) {
                            return cb(null, user);
                        } else {
                            return cb(null, false, { message: "Incorrect password" });
                        }
                    }
                });
            } else {
                return cb(null, false, { message: "User not found" });
            }
        } catch (err) {
            console.log(err);
            return cb(err);
        }
    })
);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
