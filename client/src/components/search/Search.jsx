import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./search2.css"

function Search() {
  const [input, setInput] = useState("")
  const navigate = useNavigate()
  const handle = (e) => {
    e.preventDefault()
    if (input.length !== 0) {
      // console.log(input)
      navigate(`/search/${input}`)
      setInput("")
    }

  }
  return (
    <div>
      <form action="" className='search'>
        <input type="text" onChange={(e) => { setInput(e.target.value) }} value={input} />
        <button onClick={handle}>search</button>
      </form>
    </div>
  )
}
export default Search;