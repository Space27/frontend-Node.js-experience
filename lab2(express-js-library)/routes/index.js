const express = require('express');
const router = express.Router();

let books = require("./books");

function addBook(req, res) {
    const body = req.body;
    const files = req.files;

    if (!body || !body.author || !body.title) {
        res.sendStatus(400);
    }

    let book = {
        num: Math.max(...books.map(o => o.num)) + 1,
        title: body.title,
        author: body.author,
        img: '',
        available: true
    };

    if (files && files.image && files.image.size) {
        book.img = 'downloaded/' + files.image.path.split('\\').pop().split('/').pop();
    }
    if (body.year) {
        book.year = body.year;
    }
    if (body.genre) {
        book.genre = body.genre;
    }

    books.push(book);

    res.render('index', {title: 'БУКАДИЛ', books: books});
}

router.get('/', (req, res, next) => {
    let booksCopy = Array.from(books);

    if (req.query.available) {
        booksCopy = booksCopy
            .filter(book => book.available);
    }
    if (req.query.expired) {
        booksCopy = booksCopy
            .filter(book => book.available === false && new Date(book.return_date).getTime() + 3600 * 24 * 1000 < new Date().getTime());
    }
    if (req.query.date) {
        booksCopy = booksCopy
            .filter(book => book.return_date && new Date(book.return_date).getTime() === new Date(req.query.date).getTime());
    }

    res.render('index', {title: 'БУКАДИЛ', books: booksCopy});
});

router.get('/books/:num', (req, res) => {
    let book = books.find(a => a.num === Number(req.params['num']));

    if (!book) {
        res.sendStatus(404);
    }

    res.render('book', {title: 'БУКАДИЛ', book: book});
});

router.delete('/books/:num', (req, res) => {
    books = books.filter(a => a.num !== Number(req.params['num']));

    res.render('index', {title: 'БУКАДИЛ', books: books});
});

router.post('/', (req, res) => {
    addBook(req, res);
});

router.patch('/books/:num', (req, res) => {
    const body = req.body;
    const files = req.files;

    let book = books.find(a => a.num === Number(req.params['num']));

    if (!book) {
        addBook(req, res);
        return;
    }

    for (let field in body) {
        if (body[field]) {
            book[field] = body[field];
        }
    }
    if (files && files.image && files.image.size) {
        book.img = 'downloaded/' + files.image.path.split('\\').pop().split('/').pop();
    }
    if (body.available && body.available === 'false') {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7);
        book.available = false;
        book.return_date = currentDate.toISOString().substring(0, 10);
    }

    res.render('book', {title: 'БУКАДИЛ', book: books.find(a => a.num === Number(req.params['num']))});
});

module.exports = router;
