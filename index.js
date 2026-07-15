const express = require('express');
const { Pool } = require('pg');

//web server initialisasi
const app = express();
const port = process.env.PORT || 5001;


const pool = new Pool({
    user: 'postgres',                   
    host: 'localhost',
    database: 'mahasiswa',
    password: '123', 
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
});


pool.on('connect', () => {
    console.log('Koneksi Pool ke PostgreSQL berhasil distabilkan.');
});

// 3. Middleware 
app.use(express.json());

// get api
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nama, nim, kelas FROM biodata ORDER BY id ASC');
        
        res.status(200).json({
            status: 'success',
            total_data: result.rowCount,
            data: result.rows
        });
    } catch (error) {
        console.error('sistem tidak berhasil mengambil data:', error.message);
        res.status(500).json({ 
            status: 'error', 
            message: 'Internal Server Error' 
        });
    }
});

// turn web server
app.listen(port, () => {
    console.log('sistem hidup le. Akses API di postman');
});

//post


//put


//delete


//http://localhost:${port}/api/biodata/