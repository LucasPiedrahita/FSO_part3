require('dotenv').config();
const mongoose = require('mongoose');

if (process.argv.length > 4 || process.argv.length === 3) {
  console.log(
    `Unexpected number of arguments (${process.argv.length}).\nIf you are trying to add a contact, please provide the arguments:\nnode mongo.js <name> <number>`
  );
  process.exit(1);
}

const url = process.env.MONGODB_URI;
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model('Contact', contactSchema);

if (process.argv.length === 2) {
  console.log('All contacts:');
  Contact.find({}).then((contacts) => {
    contacts.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 4) {
  const name = process.argv[2];
  const number = process.argv[3];
  const contact = new Contact({
    name,
    number,
  });
  contact.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
