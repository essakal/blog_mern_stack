import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { faFacebook, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function OneCat() {
    const [cat, setCat] = useState([])
    const { category } = useParams()
    useEffect(() => {
        axios.get(`http://localhost:5000/category/${category}`)
            .then(res => {
                setCat(res.data)
            })
    }, [category])
    return (
        <div>
            {/* <h1>all</h1> */}
            <div className='articles'>
                {cat.map(item => (
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
                        <h5>by: @{item.author.username}</h5>
                        {/* <div dangerouslySetInnerHTML={{ __html: item.content.slice(0, 80) }} /> */}
                        <h4>
                            <Link key={item._id} to={`/article/${item._id}`}>read more</Link>
                            <div>
                                {/* <FontAwesomeIcon icon={faUser} /> */}
                                <FacebookShareButton url={encodeURIComponent(`http://localhost:3000/article/${item._id}`)} quote={encodeURIComponent(item.title)}>
                                    <FontAwesomeIcon icon={faFacebook} />
                                </FacebookShareButton>
                                <WhatsappShareButton url={encodeURIComponent(`http://localhost:3000/article/${item._id}`)} quote={encodeURIComponent("title")}>
                                    <FontAwesomeIcon icon={faWhatsapp} />
                                </WhatsappShareButton>
                                <TwitterShareButton url={encodeURIComponent(`http://localhost:3000/article/${item._id}`)} quote={encodeURIComponent("title")}>
                                    <FontAwesomeIcon icon={faTwitter} />
                                </TwitterShareButton>
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
export default OneCat;