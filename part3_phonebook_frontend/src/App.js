import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import AddContactForm from "./components/AddContactForm";
import DisplayContacts from "./components/DisplayContacts";
import contactService from "./services/contacts";
import Notification from "./components/Notification";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [notification, setNotification] = useState({ message: null, type: null });
  
  useEffect(() => {
    contactService
      .getAll()
      .then(initialContacts => {
        setContacts(initialContacts)
      })
  }, [])

  const addContact = (event) => {
    event.preventDefault();
    const existingContact =
      contacts.find((contact) => contact.name === newName);
    if (existingContact) {
      updateContact(existingContact);
    } else {
      const newContact = {
        name: newName,
        number: newNumber,
      };
      contactService
        .create(newContact)
        .then(returnedContact => {
          setContacts([...contacts, returnedContact]);
          setNotification({ 
            message: `Added '${returnedContact.name}'`, 
            type: "success" 
          });
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 4000);
        })
        .catch(error => {
          console.log(error)
          setNotification({ 
            message: `${error}. Could not add '${newContact.name}' to phonebook.`, 
            type: "error" 
          });
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 4000);
        })
    }
    setNewName("");
    setNewNumber("");
  };

  const removeContact = (event, contactToRemove) => {
    event.preventDefault();
    if (window.confirm(`Delete ${contactToRemove.name}?`)) {
      contactService
        .remove(contactToRemove.id)
        .then(response => {
          setContacts(
            contacts.filter(contact => contact.id !== contactToRemove.id)
          )
          setNotification({ 
            message: `Removed '${contactToRemove.name}'`, 
            type: "success" 
          });
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 4000);
        })
        .catch(error => {
          setContacts(
            contacts.filter(contact => contact.id !== contactToRemove.id)
          )
          setNotification({ 
            message: `Contact info for '${contactToRemove.name}' has already been removed from the server`, 
            type: "error" 
          });
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 4000);
        })
    }
  }

  const updateContact = (existingContact) => {
    const confirmed = window.confirm(
      `${existingContact.name} is already in the Phonebook, would you like to update the number to ${newNumber}?`
    );
    if (confirmed) {
      const updatedContact = {...existingContact, number: newNumber}
      contactService
        .update(updatedContact)
        .then(returnedContact => {
          setContacts(
            contacts.map(contact => 
              contact.id !== returnedContact.id 
              ? contact 
              : returnedContact
            )
          )
          setNotification({ 
            message: `Updated number for '${returnedContact.name}' to '${returnedContact.number}'`, 
            type: "success" 
          });
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 4000);
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Search
        value={searchName}
        onChange={(event) => setSearchName(event.target.value)}
      />
      <AddContactForm
        onSubmit={addContact}
        nameValue={newName}
        nameOnChange={(event) => setNewName(event.target.value)}
        numberValue={newNumber}
        numberOnChange={(event) => setNewNumber(event.target.value)}
      />
      <DisplayContacts 
        contacts={contacts} 
        searchName={searchName} 
        removeContact={removeContact} 
      />
    </div>
  );
};

export default App;
