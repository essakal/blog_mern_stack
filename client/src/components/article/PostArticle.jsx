import React, { useEffect, useState } from 'react'
import axios from 'axios';
import "./postarticle.css"
// import jwt_decode from 'jwt-decode'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';

function PostArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // const [category, setCategory] = useState(["php", "react"]);
  const [image, setImage] = useState(null);
  const [userid, setUserid] = useState(null);
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()


  useEffect(() => {
    // const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    // console.log(user._id);
    setUserid(user._id)
  }, [])
  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newTag = inputValue.trim();

      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue('');
      }
    } else if (event.key === 'Backspace' && !inputValue) {
      setTags(tags.slice(0, -1));
    }
  };
  const nonsend = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const data = {};
    data.title = title;
    data.image = image;
    data.content = content;
    data.category = tags;
    data.author = userid;

    let errors = {};
    if (!title) {
      errors.title = "title is required";
    }
    if (!content) {
      errors.content = "content is required";
    }
    if (tags.length == 0) {
      errors.category = "categories are required";
    }
    if (!data.image) {
      errors.image = "image is required";
    }
    // console.log(data)
    if (Object.keys(errors).length === 0) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/article', data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }

          });
          navigate('/')
        // console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    setErrors(errors);
  }

  return (
    <div className='loginContainer2'>
      <form encType='multipart/form-data' className='loginform2'>
        <h1>add article page</h1>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={nonsend} />
        {errors.title && <div className="error">{errors.title}</div>}
        <label>Content:</label>
        {/* <textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea> */}
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}

        />
        {errors.content && <div className="error">{errors.content}</div>}
        <label>Categories:</label>
        {/* <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} /> */}
        <div className="tags-input">
          {/* <label>Tags:</label> */}
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
                onKeyUp={handleInputKeyDown}
                onKeyDown={nonsend}
                placeholder="Add category"
              />
            </li>
          </ul>
        </div>
        {errors.category && <div className="error">{errors.category}</div>}
        <label>Image:</label>
        <input type="file" accept='.png, .jpg, .jpeg' onChange={(e) => setImage(e.target.files[0])} />
        {errors.image && <div className="error">{errors.image}</div>}
        <input type="submit" value="add article" onClick={handleFormSubmit} />
      </form>
    </div>
  )
}
export default PostArticle