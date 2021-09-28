import React from 'react';

const Search = ({ value, onChange }) => (
  <div>
    Search: <input value={value} onChange={onChange} />
  </div>
);

export default Search;
