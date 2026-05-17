const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const DATA_PATH = path.join(__dirname, 'data', 'store.json');
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function createToken() {
  return crypto.randomBytes(24).toString('hex');
}

function getUserByToken(token, data) {
  return data.users.find(user => user.token === token);
}

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const token = authorization.split(' ')[1];
  const data = readData();
  const user = getUserByToken(token, data);
  if (!user) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }

  req.user = user;
  req.data = data;
  next();
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const data = readData();
  let user = data.users.find(u => u.username === username);
  if (user) {
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    if (!user.token) {
      user.token = createToken();
      writeData(data);
    }
    return res.json({ username: user.username, token: user.token });
  }

  const token = createToken();
  user = { username, password, token };
  data.users.push(user);
  data.carts[username] = [];
  writeData(data);
  res.json({ username, token });
});

app.post('/api/logout', authMiddleware, (req, res) => {
  const data = readData();
  const user = data.users.find(u => u.username === req.user.username);
  if (user) {
    user.token = null;
    writeData(data);
  }
  res.json({ success: true });
});

app.get('/api/books', (req, res) => {
  const data = readData();
  res.json({ books: data.inventory });
});

app.get('/api/cart', authMiddleware, (req, res) => {
  const data = req.data;
  const cart = data.carts[req.user.username] || [];
  const booksById = new Map(data.inventory.map(book => [book.id, book]));
  const items = cart
    .map(item => {
      const book = booksById.get(item.id);
      return book ? { ...book, quantity: item.quantity } : null;
    })
    .filter(Boolean);

  res.json({ cart: items });
});

app.post('/api/cart', authMiddleware, (req, res) => {
  const { bookId, quantity = 1 } = req.body;
  const data = req.data;
  const book = data.inventory.find(item => item.id === bookId);
  if (!book) {
    return res.status(404).json({ error: 'Book not found.' });
  }
  if (quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1.' });
  }

  const cart = data.carts[req.user.username] || [];
  const cartItem = cart.find(item => item.id === bookId);
  const requestedQuantity = cartItem ? cartItem.quantity + quantity : quantity;
  if (requestedQuantity > book.stock) {
    return res.status(400).json({ error: 'Requested quantity exceeds available stock.' });
  }

  if (cartItem) {
    cartItem.quantity = requestedQuantity;
  } else {
    cart.push({ id: bookId, quantity });
    data.carts[req.user.username] = cart;
  }

  writeData(data);
  res.json({ success: true });
});

app.put('/api/cart/:id', authMiddleware, (req, res) => {
  const bookId = Number(req.params.id);
  const quantity = Number(req.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be zero or a positive integer.' });
  }

  const data = req.data;
  const book = data.inventory.find(item => item.id === bookId);
  if (!book) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  const cart = data.carts[req.user.username] || [];
  const cartItem = cart.find(item => item.id === bookId);
  if (!cartItem) {
    return res.status(404).json({ error: 'Item not found in cart.' });
  }

  if (quantity === 0) {
    data.carts[req.user.username] = cart.filter(item => item.id !== bookId);
  } else {
    if (quantity > book.stock) {
      return res.status(400).json({ error: 'Requested quantity exceeds available stock.' });
    }
    cartItem.quantity = quantity;
  }

  writeData(data);
  res.json({ success: true });
});

app.delete('/api/cart/:id', authMiddleware, (req, res) => {
  const bookId = Number(req.params.id);
  const data = req.data;
  const cart = data.carts[req.user.username] || [];
  data.carts[req.user.username] = cart.filter(item => item.id !== bookId);
  writeData(data);
  res.json({ success: true });
});

app.post('/api/checkout', authMiddleware, (req, res) => {
  const data = req.data;
  data.carts[req.user.username] = [];
  writeData(data);
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Bookstore server running on http://localhost:${PORT}`);
});
