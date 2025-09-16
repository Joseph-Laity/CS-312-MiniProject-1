import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

// Posts storage
const posts = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
 


// Home Route
app.get('/', (req, res) => {
  res.render('index', { posts: posts });
});

// Edit Post Route
app.get('/edit/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).send('Post not found');
  }

  res.render('edit', { post });
});



// Initalize unique post id
let postId = 1;

// Post submission
app.post('/posts', (req, res) => {
  const { author, title, content } = req.body;
  const date = new Date().toLocaleString();

  const newPost = { id:postId++, author, title, content, date };
  posts.push(newPost);

  res.redirect('/');
});

// Post editing
app.post('/edit/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content, author } = req.body;

  const post = posts.find(p => p.id === postId);
  if (!post) return res.status(404).send('Post not found');

  post.title = title;
  post.content = content;
  post.author = author;
  post.date = new Date().toLocaleString();

  res.redirect('/');
});

// Post deletion
app.post('/delete/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).send('Post not found');
  }

  posts.splice(postIndex, 1);
  res.redirect('/');
});



app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});