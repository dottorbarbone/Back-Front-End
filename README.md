# Back-Front-End

This workspace contains a minimal Next.js (JavaScript, no TypeScript) scaffold.

Created files:

- [package.json](package.json)
- [next.config.js](next.config.js)
- [pages/_app.js](pages/_app.js)
- [pages/index.js](pages/index.js)
- [styles/globals.css](styles/globals.css)
- [.gitignore](.gitignore)

Run locally:

```bash
npm install
npm run dev
```

Backend API (Next.js API routes):

- `GET /api/hello` — risponde con un messaggio di saluto JSON.
- `GET /api/items` — restituisce l'array di item in memoria.
- `POST /api/items` — crea un item; body JSON: `{ "text": "..." }`.
- `DELETE /api/items?id=ID` — rimuove l'item con `id` specificato.

Esempi curl:

```bash
curl http://localhost:3000/api/hello
curl http://localhost:3000/api/items
curl -X POST -H "Content-Type: application/json" -d '{"text":"Nuovo item"}' http://localhost:3000/api/items
curl -X DELETE "http://localhost:3000/api/items?id=1"
```

Esempio fetch (browser / client):

```js
// GET
fetch('/api/items').then(r => r.json()).then(console.log)

// POST
fetch('/api/items', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ text: 'Nuovo item' })
}).then(r => r.json()).then(console.log)
```


website to learn how to bring images-file from back to front end with nextjs and mui
