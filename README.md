# Bookstore Demo

A full-stack bookstore demo with an Express backend, JSON persistence, and a vanilla JavaScript frontend.

## Features

- Backend login API with user accounts
- Persistent cart storage in `data/store.json`
- Book inventory API
- Cart management with add, update, remove, and checkout endpoints
- Static frontend served from `public/`

## Run locally

1. Open a terminal in this folder.
2. Install dependencies:
   - `npm install`
3. Start the app:
   - `npm start`
4. Open `http://localhost:3000` in your browser.

## Project structure

- `server.js` — Express backend and REST API
- `package.json` — dependencies and scripts
- `data/store.json` — persisted inventory, users, and carts
- `public/index.html` — frontend markup
- `public/styles.css` — frontend styling
- `public/app.js` — frontend login, cart, and API logic
