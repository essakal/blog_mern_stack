import axios from 'axios'
import React, { useEffect, useState } from 'react'
// import "./test.css"

function Teest() {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      const newTag = inputValue.trim();

      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue('');
      }
    } else if (event.key === 'Backspace' && !inputValue) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // do something with the author data and tags
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" />
      </label>
      <br />
      <label>
        Email:
        <input type="email" name="email" />
      </label>
      <br />
      <div className="tags-input">
        <label>Tags:</label>
        <ul className="tags-list">
          {tags.map((tag, index) => (
            <li key={index} className="tag">
              {tag}
              <button
                type="button"
                onClick={() => {
                  setTags(tags.filter((t) => t !== tag));
                }}
              >
                x
              </button>
            </li>
          ))}
          <li className="tag-input">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Add tags"
            />
          </li>
        </ul>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
export default Teest;