import './App2.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import GetArticles from './components/article/GetArticles';
import GetArticle from './components/article/GetArticle';
import Search from './components/search/Search';
import Category from './components/category/Category';
import OneCat from './components/category/OneCat';
import Resutl from './components/search/Resutl';
import Login from './components/auth/login';
import { useEffect, useState } from 'react';
import Logout from './components/auth/logout';
import Register from './components/auth/register';
import PostArticle from './components/article/PostArticle';
import Teest from './components/article/Teest';
import Mine from './components/article/Mine';
import PutArticle from './components/article/PutArticle';

function App() {
  const [login, setLogin] = useState(undefined)
  const [href, setHref] = useState("")
  const [userid, setUserid] = useState(null);
  useState(() => {
    const data = localStorage.getItem('token');
    setLogin(data);
  }, [href])

  useEffect(() => {
    // const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if(user!=null) setUserid(user._id)
    // console.log(user._id);
    
  }, [])

  return (
    <BrowserRouter>
      <div>
        <div className='header'>
          <h1 className='logo'><Link to='/'>MyBlog</Link></h1>
          <Search />
          <div>
            {/* <li><Link to='/'>Home</Link></li>
              <li><Link to='/category'>category</Link></li>
            <li><Link to='/'>mine</Link></li> */}
            {login == undefined ?
              <ul className='nav'>
                <li><Link to='/login' className='login'>Login</Link></li>
                <li><Link to='/register' className='login'>Register</Link></li>
              </ul>
              :
              // <div>
              <ul className='nav'>
                {/* <li><Link to='/mine/${userid}' >mine</Link></li> */}
                <li><Link to={`/mine/${userid}`} >mine</Link></li>
                <li><Link to='/add' >create</Link></li>
                <li><Link to='/logout' className='login'>Logout</Link></li>
              </ul>
              // </div>
            }
          </div>
        </div>
        <Routes>
          <Route path='/' element={<div><Category /><GetArticles /></div>} />
          <Route path='/login' element={<div><Login /></div>} />
          <Route path='/register' element={<div><Register /></div>} />
          <Route path='/logout' element={<div><Logout /></div>} />
          <Route path='/article/:id' element={<div><Category /><GetArticle /></div>} />
          <Route path='/update/:id' element={<div><Category /><PutArticle /></div>} />
          {/* <Route path='/article/delete/:id' element={<div><Category /><GetArticle /></div>} /> */}
          <Route path='/mine/:id' element={<div><Category /><Mine /></div>} />
          {/* <Route path='/mine/:id' element={<div><Category />mine</div>} /> */}
          <Route path='/add' element={<div><PostArticle /></div>} />
          <Route path='/teest' element={<div><Category /><Teest /></div>} />
          {/* <Route path='/category' element={<Category />}/> */}
          <Route path='/category/:category' element={<div><Category /><OneCat /></div>} />
          <Route path='/search/:word' element={<div><Category /><Resutl /></div>} />
          <Route path='*' element={<h1>not found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
