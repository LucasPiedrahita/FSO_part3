const express = require("express")
const app = express()

app.use(express.json())

let contacts = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>")
})

app.get("/info", (request, response) => {
  response.send(`
  <p>Phonebook has info for ${contacts.length} people</p>
  <p>Request processed at ${new Date()}</p>
  `)
})

app.get("/api/contacts", (request, response) => {
  response.json(contacts)
})

app.get("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.find(contact => contact.id === id)
  if (contact) {
    console.log("if");
    response.json(contact)
  } else {
    console.log("else");
    response.status(404).end()
  }
})

app.delete("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id)
  contacts = contacts.filter(contact => contact.id !== id)

  response.status(204).end()
})

const generateId = () => {
  let id = Math.floor(Math.random() * 10000000 + 1)
  while (contacts.find(contact => contact.id === id)) {
    id = Math.floor(Math.random() * 10000000 + 1)
  }
  return id
}

app.post("/api/contacts", (request, response) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: "name of contact missing"
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number of contact missing"
    })
  }
  if (contacts.find(c => c.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const contact = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  contacts = [...contacts, contact]
  response.json(contact)
})
  
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

