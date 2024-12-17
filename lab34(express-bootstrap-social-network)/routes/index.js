const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const title = 'МОЖНОWEB';

let users = require('./users');
let friends = require('./friends');
let news = require('./news');

function addUser(body, files, id = -1) {
    if (id === -1) {
        id = Math.max(...users.map(o => o.id)) + 1;
    }
    if (!body || !body.name || !body.birth || !body.email) {
        return -1;
    }

    let user = body;
    if (!body.role) {
        user.role = 'Пользователь';
    }
    if (!body.status) {
        user.status = 'Активный';
    }
    if (body.birth) {
        user.birth = new Date(new Date(body.birth).getTime() - new Date(body.birth).getTimezoneOffset() * 60000).toISOString().split('T')[0];
    }
    user.id = id;
    if (files && files.image && files.image.size) {
        user.image = `downloaded/${files.image.path.split('\\').pop().split('/').pop()}`;
    }

    users.push(user);
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users));

    return id;
}

function addPost(id, text) {
    const date = new Date();
    news[id].push({date, text});

    return {date, text};
}


router.get('/users', (req, res, next) => {
    res.render('users', {title, subtitle: 'СПИСОК ПОЛЬЗОВАТЕЛЕЙ', users});
});

router.get('/users/:id/friends', (req, res, next) => {
    const id = Number(req.params['id']);
    const user = users.find(a => a.id === id);

    if (!user) {
        res.sendStatus(404);
    }

    res.render('users', {
        title,
        subtitle: `СПИСОК ДРУЗЕЙ - ${user.name}`,
        users: users.filter(o => (friends[id] ?? []).includes(o.id))
    });
});

router.get('/users/:id/friends/news', (req, res, next) => {
    const id = Number(req.params['id']);
    const user = users.find(a => a.id === id);

    if (!user) {
        res.sendStatus(404);
    }
    let newsList = [];
    for (let friendId of friends[id] ?? []) {
        let friend = users.find(a => a.id === friendId);
        if (friend) {
            for (let post of news[friendId] ?? []) {
                newsList.push({author: friend, content: post});
            }
        }
    }
    newsList.sort((a, b) => new Date(b.content.date).getTime() - new Date(a.content.date).getTime());

    res.render('news', {title, subtitle: `НОВОСТИ ДРУЗЕЙ - ${user.name}`, news: newsList});
});

router.patch('/users/:id', (req, res, next) => {
    const id = Number(req.params['id']);
    const body = req.body;
    const files = req.files;
    let user = users.find(a => a.id === id);

    if (user) {
        for (let field in body) {
            if (body[field] && field !== 'id') {
                user[field] = body[field];
            }
        }
        if (files && files.image && files.image.size) {
            user.image = `downloaded/${files.image.path.split('\\').pop().split('/').pop()}`;
        }
        fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users));
    } else {
        addUser(body, files, id);
    }

    res.render('user', {user});
});

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'webpack', 'index.html'));
});

router.post('/', (req, res, next) => {
    const body = req.body;

    let user = users.find(a => a.email === body.email);

    if (user) {
        if (user.role === 'Администратор') {
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(404);
    }
});

router.post('/login', (req, res, next) => {
    const body = req.body;

    let user = users.find(a => a.email === body.email);

    if (user) {
        res.status(200).send(JSON.stringify({id: user.id}));
    } else {
        res.status(404).send(JSON.stringify({id: -1}));
    }
});


router.post('/register', (req, res, next) => {
    const body = req.body;

    let user = users.find(a => a.email === body.email);

    if (user) {
        res.status(200).send({id: user.id});
    } else {
        res.status(200).send({id: addUser(body, null)});
    }
});

router.get('/user', (req, res, next) => {
    res.status(200).send(users);
});

router.get('/user/:id', (req, res, next) => {
    const id = Number(req.params['id']);

    let user = users.find(a => a.id === id);

    if (user) {
        res.status(200).send(user);
    } else {
        res.sendStatus(404);
    }
});

router.get('/user/:id/news', (req, res, next) => {
    const id = Number(req.params['id']);

    let user = users.find(a => a.id === id);

    if (user) {
        res.status(200).send(news[id].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
        res.sendStatus(404);
    }
});

router.get('/user/:id/friends', (req, res, next) => {
    const id = Number(req.params['id']);

    let user = users.find(a => a.id === id);

    if (user) {
        res.status(200).send(friends[id]);
    } else {
        res.sendStatus(404);
    }
});

router.get('/user/:id/friends/news', (req, res, next) => {
    const id = Number(req.params['id']);

    let user = users.find(a => a.id === id);

    if (user) {
        let newsList = [];
        for (let friendId of friends[id] ?? []) {
            let friend = users.find(a => a.id === friendId);
            if (friend) {
                for (let post of news[friendId] ?? []) {
                    newsList.push({author: friend, content: post});
                }
            }
        }
        newsList.sort((a, b) => new Date(b.content.date).getTime() - new Date(a.content.date).getTime());
        res.status(200).send(newsList);
    } else {
        res.sendStatus(404);
    }
});

router.post('/user/:id/news', (req, res, next) => {
    const body = req.body;
    const id = Number(req.params['id']);

    let user = users.find(a => a.id === id);

    if (user) {
        addPost(id, body.text);
        res.status(200).send(news[id].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
        res.sendStatus(404);
    }
});

router.patch('/user/:id', (req, res, next) => {
    const id = Number(req.params['id']);
    const body = req.body;
    const files = req.files;
    let user = users.find(a => a.id === id);

    if (user) {
        for (let field in body) {
            if (body[field] && field !== 'id') {
                user[field] = body[field];
            }
        }
        if (files && files.image && files.image.size) {
            user.image = `downloaded/${files.image.path.split('\\').pop().split('/').pop()}`;
        }
        fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users));
    } else {
        addUser(body, files, id);
        user = users[users.length];
    }

    res.status(200).send(user);
});

router.delete('/user/:id/image', (req, res, next) => {
    const id = Number(req.params['id']);
    let user = users.find(a => a.id === id);

    if (user) {
        delete user.image;
        res.status(200).send(user);
    } else {
        res.sendStatus(404);
    }
});

router.post('/user/:id/friends/:fid', (req, res, next) => {
    const id = Number(req.params['id']);
    const fid = Number(req.params['fid']);
    let user = users.find(a => a.id === id);

    if (user && users.find(a => a.id === fid)) {
        if (friends[id].includes(fid)) {
            res.sendStatus(409);
        } else {
            friends[id].push(fid);
            res.status(200).send(friends[id]);
        }
    } else {
        res.sendStatus(404);
    }
});

router.delete('/user/:id/friends/:fid', (req, res, next) => {
    const id = Number(req.params['id']);
    const fid = Number(req.params['fid']);
    let user = users.find(a => a.id === id);

    if (user && users.find(a => a.id === fid)) {
        if (friends[id].includes(fid)) {
            friends[id] = friends[id].filter(a => a !== fid);
            res.status(200).send(friends[id]);
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
module.exports.user = addUser;
module.exports.post = addPost;
