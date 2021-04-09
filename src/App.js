import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import './App.css';

import { auth } from './services/firebase';


export default function App() {
  const [state, setState] = useState({
    user: null,
    videoblogs: [{}],
    newBlog: {
      name: '',
      poster: '',
      author: '',
      rating: '1',
      date: '',
      howtoenjoy: ''
    },
  });


  async function getAppData() {
    const BASE_URL = 'http://localhost:3001/api/videoblogs';
    const videoblogs = await fetch(BASE_URL).then(res => res.json());
    setState((prevState) => ({
      ...prevState,
      videoblogs,
    }))
  }

  useEffect(() => {
    getAppData();
    auth.onAuthStateChanged(user => {
      if(user) {
        setState(prevState => ({
          ...prevState,
          user,
        }))
      } else {
        setState(prevState => ({
          ...prevState,
          user: null,
        }))
      }
    })
  }, []);


  async function addBlog(e) {
    if(!state.user) return;

    e.preventDefault();
    const BASE_URL = 'http://localhost:3001/api/videoblogs';
    const videoblog = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify(state.newBlog)
    }).then(res => res.json());
    setState((prevState) => ({
      ...prevState,
      videoblogs: [...prevState.videoblogs, videoblog],
      newBlog: {
        name: '',
        poster: '',
        author: '',
        rating: '1',
        date: '',
        howtoenjoy: '',
      },
    }));
  }

  function handleChange(e) {
    setState((prevState) => ({
      ...prevState,
      newBlog: {
        ...prevState.newBlog,
        [e.target.name]: e.target.value
      }
    }))
  }


  return (
    <>
      <Header user={state.user} />
      <main>
        <section>
          {state.videoblogs.map((v) => (
            <article key={v.videoblog}>
              <div>{v.name}</div>
              <div><img src={v.poster} /></div>
              <div>{v.author}</div>
              <div>{v.rating}</div>
              <div>{v.date}</div>
              <div>{v.howtoenjoy}</div>
            </article>
          ))}
          <hr />
          
        
      {
        state.user &&
        <>
    <form onSubmit={addBlog}>
          <label>
            <span>Game Name</span>
            <input name='name' value={state.newBlog.name} onChange={handleChange} />
          </label>
          <label>
            <span>Poster Link</span>
            <input name='poster' value={state.newBlog.poster} onChange={handleChange} />
          </label>
          <label>
            <span>Author</span>
            <input name='author' value={state.newBlog.author} onChange={handleChange} />
          </label>
          <label>
            <span>Rating</span>
            <select name='rating' value={state.newBlog.rating} onChange={handleChange} >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          <label>
            <span>Date</span>
            <input name='poster' type='date' value={state.newBlog.date} onChange={handleChange} />
          </label>
          <label>
            <span>How to Enjoy</span>
            <textarea name='howtoenjoy' value={state.newBlog.howtoenjoy} onChange={handleChange}></textarea>
          </label>
          <button>Add Videogame Blog</button>
    </form>
    </>
      }
      </section>
      </main>
    </>
  );
}
