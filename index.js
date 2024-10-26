const express = require('express');
const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Buat objek dengan 4 atribut
let items = [
    { id: 1, name: 'Item 1', description: 'Barang Pertama', price: 100 },
    { id: 2, name: 'Item 2', description: 'Barang Kedua', price: 200 }
];

// Route: GET semua data item
app.get('/items', (req, res) => {
    res.json(items);
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
