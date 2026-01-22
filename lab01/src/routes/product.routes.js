const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

function isAuthenticated(req) {
    const cookie = req.headers.cookie || '';
    return cookie.split(';').map(s => s.trim()).some(c => c === 'loggedIn=1');
}

// Home - Xem danh sách sản phẩm (bảo vệ bằng cookie đơn giản)
router.get('/', async (req, res) => {
    if (!isAuthenticated(req)) {
        return res.redirect('/login');
    }
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.render('products', { products: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi khi truy vấn dữ liệu.');
    }
});

// Add product - Thêm sản phẩm mới
router.post('/add', async (req, res) => {
    const { name, price, quantity } = req.body;
    try {
        await db.query('INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)', [name, price, quantity]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Không thể thêm sản phẩm.');
    }
});

// Edit product - Cập nhật thông tin sản phẩm
router.get('/edit/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
        if (rows.length === 0) {
            return res.status(404).send('Sản phẩm không tồn tại.');
        }
        res.render('edit-product', { product: rows[0] }); // Giả sử bạn có một form để sửa sản phẩm
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi khi truy vấn sản phẩm.');
    }
});

router.post('/edit/:id', async (req, res) => {
    const productId = req.params.id;
    const { name, price, quantity } = req.body;
    try {
        await db.query('UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?', [name, price, quantity, productId]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi khi cập nhật sản phẩm.');
    }
});

// Delete product - Xóa sản phẩm
router.post('/delete/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        await db.query('DELETE FROM products WHERE id = ?', [productId]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi khi xóa sản phẩm.');
    }
});

// Login page (render with optional error)
router.get('/login', (req, res) => {
    res.render('login', { error: req.query.error });
});

// Handle login (hard-coded username/password)
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123') {
        // Set a simple httpOnly cookie to remember login
        res.cookie('loggedIn', '1', { httpOnly: true });
        return res.redirect('/');
    }
    res.redirect('/login?error=1');
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('loggedIn');
    res.redirect('/login');
});

module.exports = router;
