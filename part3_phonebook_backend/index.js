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
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-request-data"))

app.get("/info", (request, response, next) => {
  Contact.count()
    .then(result => {
      response.send(`
        <p>Phonebook has info for ${result} people</p>
        <p>Request processed at ${new Date()}</p>
      `)
    })
    .catch(error => next(error))
})

app.get("/api/contacts", (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get("/api/contacts/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete("/api/contacts/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/contacts", (request, response, next) => {
  const body = request.body
  const contact = new Contact({
    name: body.name,
    number: body.number,
  })
  contact.save()
    .then(savedContact => {
      response.json(savedContact)
    })
    .catch(error => next(error))
})

app.put("/api/contacts/:id", (request, response, next) => {
  const body = request.body
  // if (!body.number) {
  //   return response.status(400).json({error: "number of contact missing"})
  // }
  
  const contact = {
    name: body.name,
    number: body.number
  }

  const opts = { runValidators: true, new: true }
  Contact.findByIdAndUpdate(request.params.id, contact, opts)
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

