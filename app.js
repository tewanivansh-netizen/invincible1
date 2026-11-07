require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const db = require("./database/eventDb");
const crypto = require("crypto");
// const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const multer = require("multer");
const cors = require("cors"); // CORS Setup

// 🔹 User-defined UUID v4 function
function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
  );
}

// Test
// console.log(generateUUID());

const app = express();
// const port = 3000;
const port = process.env.PORT || 3000;

// Trust reverse proxy (Render, Heroku, etc.) for secure cookie handling over HTTPS
app.set("trust proxy", 1);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/Events"); // jaha store karna hai
  },
  filename: (req, file, cb) => {
    // Date.now() + original file extension add karo
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 🔧 Middlewares
app.use(cors());
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // localhost pe false
      sameSite: "lax",
    },
  })
);

function requireLogin(req, res, next) {
  if (!req.session || !req.session.user || !req.session.user.user_id) {
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(401).json({ error: "Please login to book" });
    }
    return res.redirect("/register");
  }
  next();
}

// 🛣️ View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 📁 Static Files (if any)
app.use(express.static("public"));

// 🧑 Temporary user storage
let users = [];

// 🏠 Home Route
app.get("/", (req, res) => {
  res.render("home", { user: req.session.user });
});

// 📝 Signup Page
app.get("/register", (req, res) => {
  res.render("register", { user: req.session.user });
});

// 🔐 Signup Form Submit
app.post("/signup", async (req, res) => {
  try {
    const { username, email, contact, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = generateUUID();

    await db.query(
      "INSERT INTO users (user_id, user_name, email, contact, password) VALUES (?, ?, ?, ?, ?)",
      [user_id, username, email, contact, hashedPassword]
    );

    const user = { user_id, username, email, contact };
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send("Unable to register account. Please try again.");
  }
});

// 🔓 Login Form Submit
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE user_name = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return res.send("❌ User not found");
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("❌ Invalid password");
    }

    req.session.user = {
      user_id: user.user_id,
      username: user.user_name,
    };

    res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("⚠️ Server error");
  }
});

// Profile Page
app.get("/profile", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/register");
  }

  const user_id = req.session.user.user_id;

  try {
    // Booking ke saath event details bhi
    const [bookings] = await db.query(
      `SELECT b.booking_id, b.participants_count, 
              e.title, e.tagline, e.image, e.duration, e.difficulty, 
              e.age_group, e.altitude, e.price, e.description, e.event_date
       FROM bookings b
       JOIN events e ON b.event_id = e.event_id
       WHERE b.user_id = ?`,
      [user_id]
    );

    // Har booking ke participants bhi nikal lo
    for (let booking of bookings) {
      const [participants] = await db.query(
        "SELECT participant_id, first_name, last_name, gender, birthdate, phone FROM booking_participants WHERE booking_id = ?",
        [booking.booking_id]
      );
      booking.participants = participants;
    }

    res.render("profile", { user: req.session.user, bookings });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).send("Unable to load profile. Please try again later.");
  }
});

// 🗺️ About Page
app.get("/about", (req, res) => {
  res.render("about");
});

// Add Event
// Insert Event
app.post("/events", async (req, res) => {
  const { title, image, description } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO events_summary (title, image, description) VALUES (?, ?, ?)",
      [title, image, description]
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error("Add event summary error:", err);
    res.status(500).json({ error: "Failed to add event" });
  }
});

// Get All Events
app.get("/events", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM events_summary");
    res.render("events", { events: results });
  } catch (err) {
    console.error("Database error in /events:", err);
    res.status(500).send("Unable to load events at this moment. Please check back shortly.");
  }
});

// Event Details Page
app.get("/events/:title", async (req, res) => {
  const eventTitle = req.params.title;
  const decodedTitle = decodeURIComponent(eventTitle);

  try {
    const [results] = await db.query("SELECT * FROM events WHERE title = ?", [
      decodedTitle,
    ]);

    if (results.length === 0) {
      return res.status(404).send("Event not found");
    }
    res.render("eventDetails", { event: results[0] });
  } catch (err) {
    console.error("Error fetching event details:", err);
    res.status(500).send("Unable to load event details. Please try again later.");
  }
});

// Events Bookings
app.post("/book-event", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Please login to book an event.");
  }

  const { event_id, firstName, lastName, phone, birthdate, gender } = req.body;

  const participants = [];
  if (firstName && Array.isArray(firstName)) {
    for (let i = 0; i < firstName.length; i++) {
      participants.push({
        first_name: firstName[i],
        last_name: Array.isArray(lastName) ? lastName[i] : lastName,
        phone: Array.isArray(phone) ? phone[i] : phone,
        birthdate: Array.isArray(birthdate) ? birthdate[i] : birthdate,
        gender: Array.isArray(gender) ? gender[i] : gender,
      });
    }
  } else if (firstName && typeof firstName === "string") {
    participants.push({
      first_name: firstName,
      last_name: Array.isArray(lastName) ? lastName[0] : lastName,
      phone: Array.isArray(phone) ? phone[0] : phone,
      birthdate: Array.isArray(birthdate) ? birthdate[0] : birthdate,
      gender: Array.isArray(gender) ? gender[0] : gender,
    });
  }

  if (!participants || participants.length === 0) {
    return res.status(400).send("At least one participant is required.");
  }

  const participants_count = participants.length;
  const user_id = req.session.user.user_id;

  try {
    // STEP 1: Bookings table me insert
    const [result] = await db.query(
      "INSERT INTO bookings (user_id, event_id, participants_count) VALUES (?, ?, ?)",
      [user_id, event_id, participants_count]
    );

    const booking_id = result.insertId; // yeh naya booking id milega

    // STEP 2: Participants table me insert
    for (const p of participants) {
      await db.query(
        `INSERT INTO booking_participants 
        (booking_id, first_name, last_name, phone, birthdate, gender) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          booking_id,
          p.first_name,
          p.last_name,
          p.phone,
          p.birthdate,
          p.gender,
        ]
      );
    }

    res.redirect("/profile");
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).send("Unable to complete booking. Please try again later.");
  }
});

// UPDATING BOOKINGS
app.patch("/update-booking/:booking_id", async (req, res) => {
  const bookingId = req.params.booking_id;
  const participantIds = req.body.participantId || req.body["participantId[]"] || [];
  const firstNames = req.body.firstName || req.body["firstName[]"] || [];
  const lastNames = req.body.lastName || req.body["lastName[]"] || [];
  const phones = req.body.phone || req.body["phone[]"] || [];
  const birthdates = req.body.birthdate || req.body["birthdate[]"] || [];
  const genders = req.body.gender || req.body["gender[]"] || [];

  const idArr = Array.isArray(participantIds) ? participantIds : (participantIds ? [participantIds] : []);
  const fnArr = Array.isArray(firstNames) ? firstNames : (firstNames ? [firstNames] : []);
  const lnArr = Array.isArray(lastNames) ? lastNames : (lastNames ? [lastNames] : []);
  const phArr = Array.isArray(phones) ? phones : (phones ? [phones] : []);
  const bdArr = Array.isArray(birthdates) ? birthdates : (birthdates ? [birthdates] : []);
  const gdArr = Array.isArray(genders) ? genders : (genders ? [genders] : []);

  try {
    for (let i = 0; i < fnArr.length; i++) {
      const id = idArr[i];
      const fn = fnArr[i];
      const ln = lnArr[i];
      const ph = phArr[i];
      const bd = bdArr[i];
      const gd = gdArr[i];

      if (id) {
        // UPDATE existing participant
        const sqlUpdate = `
          UPDATE booking_participants 
          SET first_name = ?, last_name = ?, phone = ?, birthdate = ?, gender = ? 
          WHERE participant_id = ?
        `;
        await db.query(sqlUpdate, [fn, ln, ph, bd, gd, id]);
      } else {
        // INSERT new participant
        const sqlInsert = `
          INSERT INTO booking_participants 
            (booking_id, first_name, last_name, phone, birthdate, gender) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.query(sqlInsert, [bookingId, fn, ln, ph, bd, gd]);
      }
    }

    if (fnArr.length > 0) {
      await db.query(
        "UPDATE bookings SET participants_count = ? WHERE booking_id = ?",
        [fnArr.length, bookingId]
      );
    }

    res.redirect("/profile");
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).send("Error updating participants.");
  }
});

// DELETE BOOKING
app.delete("/delete-booking/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const sql = "DELETE FROM bookings WHERE booking_id = ?";

    const [result] = await db.query(sql, [bookingId]); // await query execution

    if (result.affectedRows === 0) {
      return res.status(404).send("Booking not found");
    }

    console.log("✅ Booking deleted:", result);
    res.redirect("/profile"); // redirect back to profile dashboard
  } catch (err) {
    console.error("❌ Error deleting booking:", err);
    res.status(500).send("Error deleting booking");
  }
});

//------------------------🚪 LOGOUT ---------------------------
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.send("❌ Error logging out");
    }
    // res.send("✅ Logged out successfully");
    res.redirect("/");
  });
});

// 🟢 Server Start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ---------------------------ADMIN PANEL-------------------------------

// Main admin panel page
app.get("/admin_panel", async (req, res) => {
  try {
    const [users] = await db.query("SELECT COUNT(*) AS userCount FROM users");
    const [events] = await db.query("SELECT COUNT(*) AS eventCount FROM events");
    const [bookings] = await db.query(
      "SELECT COUNT(*) AS bookingCount FROM bookings"
    );

    res.render("admin_panel", {
      userCount: users[0]?.userCount || 0,
      eventCount: events[0]?.eventCount || 0,
      bookingCount: bookings[0]?.bookingCount || 0,
    });
  } catch (err) {
    console.error("Admin panel error:", err);
    res.status(500).send("Unable to load admin panel.");
  }
});

// Acception and storing event summary in db
app.post("/newEvent_summary", upload.single("image"), async (req, res) => {
  try {
    const { event_title, event_description } = req.body;
    const image = req.file; // multer ke through aayi file
    const relativePath = image ? "images/Events/" + image.filename : null;

    // ✅ Insert query (events_summary table me)
    const sql =
      "INSERT INTO events_summary (title, image, description) VALUES (?, ?, ?)";
    await db.query(sql, [event_title, relativePath, event_description]);

    res.send("Event saved successfully!");
  } catch (err) {
    console.error("Error inserting event summary:", err);
    res.status(500).send("Database error saving event summary.");
  }
});

// Add detailed event info
app.post(
  "/newEvent_details",
  upload.single("eventDetails_image"),
  async (req, res) => {
    try {
      console.log("REQ.BODY:", req.body);
      console.log("REQ.FILE:", req.file);

      const {
        eventDetails_title,
        eventDetails_tagline,
        eventDetails_duration,
        eventDetails_difficulty,
        eventDetails_ageGroup,
        eventDetails_altitude,
        eventDetails_price,
        eventDetails_desc,
        eventDetails_date,
      } = req.body;

      const imagePath = req.file ? "/images/Events/" + req.file.filename : null;

      // ✅ Date format MySQL compatible (YYYY-MM-DD)
      let eventDate = eventDetails_date
        ? new Date(eventDetails_date).toISOString().split("T")[0]
        : null;

      const sql = `
      INSERT INTO events 
      (title, tagline, image, duration, difficulty, age_group, altitude, price, description, event_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const [result] = await db.query(sql, [
        eventDetails_title,
        eventDetails_tagline,
        imagePath,
        eventDetails_duration,
        eventDetails_difficulty,
        eventDetails_ageGroup,
        eventDetails_altitude,
        eventDetails_price,
        eventDetails_desc,
        eventDate,
      ]);

      console.log("✅ Event inserted:", result);
      res.redirect("/"); // ✅ redirect after success
    } catch (err) {
      console.error("❌ SQL ERROR:", err.message);
      res.status(500).send("Error saving event details.");
    }
  }
);

// Admin Events Page - List all events
app.get("/admin_events", async (req, res) => {
  try {
    const [events] = await db.query("SELECT * FROM events_summary");
    res.render("admin_events", { events });
  } catch (err) {
    console.error("Admin events error:", err);
    res.status(500).send("Unable to load events.");
  }
});

app.delete("/admin_events/:title", async (req, res) => {
  const eventTitle = req.params.title;

  try {
    await db.query("DELETE FROM events_summary WHERE title = ?", [eventTitle]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting event summary:", err);
    res.json({ success: false });
  }
});

// Admin Login Page
app.get("/admin_login", (req, res) => {
  res.render("admin_login");
});

// Admin validation
app.post("/admin_login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("admin_login", { error: "Please enter both email and password" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM admin WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows && rows.length > 0) {
      req.session.admin = rows[0];
      return res.redirect("/admin_panel");
    } else {
      return res.render("admin_login", { error: "Invalid Email or Password" });
    }
  } catch (err) {
    console.error("Admin login error:", err);
    return res.render("admin_login", { error: "Database error during login. Please try again." });
  }
});

// Admin Logout
app.get("/admin_logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.send("Error logging out");
        }
        res.redirect("/admin_login");
    });
});



module.exports = app;
