import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

function GetArticles() {
    const [data, setData] = useState({})
    const { id } = useParams()
    const [token, setToken] = useState();
    const [comment, setComment] = useState('');
    const [err, setErr] = useState();
    // const params = useParams('id')
    // const user = JSON.parse(localStorage.getItem('user'));
    useEffect(() => {
        axios.get(`http://localhost:5000/article/${id}`)
            .then(res => setData(res.data))
        const token = localStorage.getItem('token');
        setToken(token)
    }, [data])
    const handle = (e) => {
        e.preventDefault()
        const user = JSON.parse(localStorage.getItem('user'));
        const cmt = {}
        cmt.user = user._id
        cmt.cmt = comment
        // console.log(cmt)
        if (comment == "") {
            console.log("ghir wach men niytek")
            setErr("err")
        }
        else {
            axios.post(`http://localhost:5000/cmt/${id}`, cmt, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setComment('')
            setErr('')
        }
    }
    return (
        <div>
            <div className='blog-container'>
                <h1 className='blog-title'>{data.title}</h1>
                <img className='blog-image' src={`http://localhost:5000/${encodeURIComponent(data.image)}`} alt="img" />
                <div className='blog-content' dangerouslySetInnerHTML={{ __html: data.content }} />
                <div className="comments">
                    <h2>Comments</h2>
                    {token &&
                        <div>
                            <form>
                                <div className="form-group">
                                    <input className={err=="err"? 'err': 'noerr'} onChange={e => setComment(e.target.value)} value={comment} required placeholder='write a comment...' />
                                </div>
                                <button onClick={handle} type="submit">comment</button>
                            </form>
                        </div>
                    }
                    <div>
                        {data.comments &&
                            <div>
                                {data.comments && data.comments.map((item, index) => (
                                    // <h1>{item.cmt}</h1>
                                    <div key={index} className='cmt'>
                                        <h5>{item.user.username}</h5>
                                        <p>{item.cmt}</p>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}
export default GetArticles