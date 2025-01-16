const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set view engine to EJS
app.set('view engine', 'ejs');

// JSON dosyasını okuyup yazmak için yardımcı fonksiyonlar
function readBlogPosts() {
    try {
        const data = fs.readFileSync('blog.json');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveBlogPosts(posts) {
    fs.writeFileSync('blog.json', JSON.stringify(posts, null, 2));
}

// Anasayfa: Blog Yazılarını Göster (Başlıklarla)
app.get('/', (req, res) => {
    const posts = readBlogPosts();
    res.render('index', { posts });
});

// Admin Paneli
app.get('/admin', (req, res) => {
    res.render('admin');
});

// Admin Panelinden Blog Yazısı Eklemek
app.post('/admin', (req, res) => {
    const { title, content } = req.body;

    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Aylar sıfırdan başladığı iiçin 1 eklendi
    const year = today.getFullYear();
    const allDay = day + "." + month + "." + year

    const newPost = {
        title,
        content,
        date: allDay
    };

    const posts = readBlogPosts();
    posts.push(newPost);
    saveBlogPosts(posts);

    res.redirect('/');
});

// Blog Detayları Sayfası
app.get('/post/:index', (req, res) => {
    const posts = readBlogPosts();
    const post = posts[req.params.index];
    if (post) {
        res.render('post', { post });
    } else {
        res.status(404).send('Blog yazısı bulunamadı');
    }
});

// Sunucuyu Başlat
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
