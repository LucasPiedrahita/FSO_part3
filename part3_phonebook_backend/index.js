// TODO: Figure out why app crashes in heroku
require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Contact = require('./models/contact')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

// Configure logging with morgan
morgan.token('post-request-data', (req, res) => {
  if (req.method === "POST") {
      return JSON.stringify(req.body)
  }
  return "-"
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-request-data")
)


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
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get("/api/contacts/:id", (request, response) => {
  const id = Number(request.params.id)
  const contact = contacts.find(contact => contact.id === id)
  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/contacts/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => console.log(error))
})

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

  // Check if name is in phonebook before adding a new contact
  Contact.findOne({ name: body.name })
    .then(result => {
      if (result) { 
        return response.status(400).json({
          error: "name must be unique"
        })
      }

      const contact = new Contact({
        name: body.name,
        number: body.number,
      })
      contact.save().then(savedContact => {
        response.json(savedContact)
      })
    })
    .catch((error) => {
      console.log(error);
    })
})

app.put("/api/contacts/:id", (request, response) => {
  const body = request.body
  const id = Number(request.params.id)
  if (!body.number) {
    return response.status(400).json({
      error: "number of contact missing"
    })
  }
  
  contacts = contacts.map(contact => {
    if (id === contact.id) {
      return {
        id: contact.id,
        name: contact.name,
        number: body.number
      }
    }
    return contact
  })

  response.json(body)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

