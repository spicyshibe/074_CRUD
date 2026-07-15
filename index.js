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
    console.log('sistem hidup cuyyy. Akses API di postman');
});

//post
app.post('/', async (req, res) => {
    const { nama, nim, kelas } = req.body

    if (!nama || !nim || !kelas) {
        return res.status(400).json({
            status: 'fail',
            message: 'Nama, nim, dan kelas harus diisi'
        });
    }

    try {
        const query = 'INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *'
        const values = [nama, nim, kelas]
        const result = await pool.query(query, values)

        res.status(201).json({
            status: 'success',
            message: 'Data berhasil ditambahkan',
            data: result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }

}  
})

//put

app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas} = req.body;

    try {
        const query = 'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *';
        const values = [nama, nim, kelas, id];
        const result = await pool.query(query, values);
        res.status(200).json({
            status: 'success',
            message: 'Data berhasil di anuin';
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            status: 'error', 
            message: error.message
        })
    }
})


//delete

