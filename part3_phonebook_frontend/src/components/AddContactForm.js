import React from 'react';

const AddContactForm = ({ onSubmit, nameValue, nameOnChange, numberValue, numberOnChange }) => (
  <>
    <h2>Add a contact</h2>
    <form onSubmit={onSubmit}>
      <div>
        Name:{''}
        <input value={nameValue} onChange={nameOnChange} />
      </div>
      <div>
        Number:{''}
        <input value={numberValue} onChange={numberOnChange} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  </>
);

export default AddContactForm;
