import React from "react";

const DisplayContacts = ({ contacts, searchName, removeContact }) => {
  return (
    <>
      <h2>Numbers</h2>
      {contacts
        .filter((contact) => {
          const searchNameEscaped = searchName.replace(
            /[-/\\^$*+?.()|[\]{}]/g,
            "\\$&"
          );
          const searchRegex = new RegExp(`${searchNameEscaped}`, "i");
          return searchRegex.test(contact.name);
        })
        .map((contact) => (
          <p key={contact.id}>
            {contact.name} {contact.number}{" "}
            <button onClick={(event) => removeContact(event, contact)}>
              Delete
            </button>
          </p>
        ))}
    </>
  );
};

export default DisplayContacts;
