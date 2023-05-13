import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "./category2.css"

function Category() {
    const [cat, setCat] = useState([])
    const [href, setHref] = useState("")
    const { category } = useParams()
    useEffect(() => {
        axios.get('http://localhost:5000/categories')
            .then(res => {
                setCat(res.data)
            })
    }, [])

    useEffect(() => {
        const url = window.location.href
        const parts = url.split("/");
        setHref(parts[parts.length - 1])
        // console.log(category)
    }, [category])

    return (
        <div className='categories'>
            <p>
                <Link to={`/`} className={!href ? "onecat onecatyes" : "onecat"}>
                    all
                </Link>
            </p>
            {cat.map((item, index) => (<p key={index}>
                <Link to={`/category/${item._id}`} className={item._id == href ? "onecat onecatyes" : "onecat"}>
                    {item._id}
                    {/* <span>{item.count}</span> */}
                </Link>
            </p>))}
        </div>
    )
}
export default Category;