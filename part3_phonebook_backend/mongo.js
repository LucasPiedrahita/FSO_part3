const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument:\nnode mongo.js <password>')
  process.exit(1)
}
if (process.argv.length > 5 || process.argv.length === 4) {
  console.log(`Unexpected number of arguments (${process.argv.length}).\nIf you are trying to add a contact, please provide the arguments:\nnode mongo.js <password> <name> <number>`)
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fso-editor:${password}@fsopart3.gy2bt.mongodb.net/phonebook-app?retryWrites=true&w=majority`
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  "name": String, 
  "number": String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
  console.log("All contacts:")
  Contact
    .find({})
    .then(contacts => {
      contacts.forEach(contact => {
        console.log(`${contact.name} ${contact.number}`)
      })
      mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const contact = new Contact({
    name,
    number,
  })
  contact.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} 
