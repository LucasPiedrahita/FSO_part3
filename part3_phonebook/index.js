const express = require("express")
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
