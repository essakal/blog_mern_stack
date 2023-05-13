import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { faFacebook, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function Mine() {
    const [cat, setCat] = useState([])
    const { id } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:5000/mine/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setCat(res.data)
            })
    }, [id])
    return (
        <div>
            <div className='articles'>
                {cat.map(item => (
                    // <Link key={item._id} to={`/article/${item._id}`}>
                    <div className='article' key={item._id}>
                        <Link to={`/article/${item._id}`}>
                        <div className='imgdiv' style={{backgroundImage: `url("http://localhost:5000/${encodeURIComponent(item.image)}")`}}>
                                {/* {console.log(item.image)} */}
                                {/* <img src={`http://localhost:5000/${item.image}`} alt="img" /> */}
                            </div>
                        </Link>
                        <div className='cat'>
                            {item.category.map((cat, index) => (
                                <Link key={index} to={`/category/${cat}`}>{cat}</Link>
                            ))}
                        </div>
                        <h1>{item.title}</h1>
                        {/* <h5>by: @{item.author.username}</h5> */}
                        {/* <div dangerouslySetInnerHTML={{ __html: item.content.slice(0, 80) }} /> */}
                        <h4>
                            <Link key={item._id} to={`/article/${item._id}`}>read more</Link>
                            <div>
                                <button className='edit-button' onClick={()=>{
                                    navigate(`/update/${item._id}`)
                                }}>edit</button>

                                <button className='delete-button' onClick={() => {
                                    const token = localStorage.getItem('token');
                                    axios.delete(`http://localhost:5000/article/${item._id}`, {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    })
                                        .then(res => {
                                            navigate("/")
                                        })
                                }}>delete</button>
                            </div>
                        </h4>
                    </div>
                    // </Link>
                ))
                }
            </div >
        </div>
    )
}
export default Mine;