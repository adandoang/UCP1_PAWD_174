const express = require('express');
const app = express();
const perawatRoutes = require('./routes/perawatdb.js');
require('dotenv').config();
const port = process.env.PORT;
const db = require('./database/db');
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');


app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());


app.use(session({
    secret: process.env.SESSION_SECRET, // Gunakan secret key yang aman
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

app.use('/', authRoutes);
app.use('/perawat', perawatRoutes);
app.use('/pasien', perawatRoutes);
app.set('view engine' , 'ejs');

app.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
        layout : 'layouts/main-layout'
    });
});

app.get('/perawat-view', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM perawat', (err, perawat) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('perawat', {
            layout: 'layouts/main-layout',
            perawat: perawat
        });
    });
});


app.get('/pasien-view', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM pasien', (err, pasien) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('pasien', {
            layout: 'layouts/main-layout',
            pasien: pasien
        });
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Could not log out');
        }
        res.redirect('/login'); // Arahkan ke halaman login setelah logout
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});