const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua Nama
router.get('/', (req, res) => {
    db.query('SELECT * FROM perawat', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan Nama berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM perawat WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Nama tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan Nama baru
router.post('/', (req, res) => {
    const { nama } = req.body;
    if (!nama || nama.trim() === '') {
        return res.status(400).send('Nama tidak boleh kosong');
    }

    db.query('INSERT INTO perawat (nama) VALUES (?)', [nama.trim()], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newperawat = { id: results.insertId, nama: nama.trim(), completed: false };
        res.status(201).json(newperawat);
    });
});

// Endpoint untuk memperbarui Nama
router.put('/:id', (req, res) => {
    const { nama, completed } = req.body;

    db.query('UPDATE perawat SET nama = ?, completed = ? WHERE id = ?', [nama, completed, req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Nama tidak ditemukan');
        res.json({ id: req.params.id, nama, completed });
    });
});

// Endpoint untuk menghapus Nama
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM perawat WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Nama tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;