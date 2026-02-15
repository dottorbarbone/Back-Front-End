let items = [
  { id: 1, text: 'Item di esempio' }
]
let nextId = 2

export default function handler(req, res) {
  const { method } = req

  if (method === 'GET') {
    res.status(200).json(items)
    return
  }

  if (method === 'POST') {
    const { text } = req.body || {}
    if (!text) {
      res.status(400).json({ error: 'Campo "text" richiesto' })
      return
    }
    const item = { id: nextId++, text }
    items.push(item)
    res.status(201).json(item)
    return
  }

  if (method === 'DELETE') {
    const { id } = req.query || {}
    const numId = parseInt(id, 10)
    if (!numId) {
      res.status(400).json({ error: 'Query param "id" richiesto' })
      return
    }
    items = items.filter((i) => i.id !== numId)
    res.status(200).json({ ok: true })
    return
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
  res.status(405).end(`Method ${method} Not Allowed`)
}
