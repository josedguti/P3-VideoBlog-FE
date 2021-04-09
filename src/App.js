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
    const BASE_URL = '';
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
    const BASE_URL = '';
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

          {/* display all the blog info here like doing the map function so it can display all the previous blogs. */}
        
      {
        state.user &&
        <>
    <form>

    </form>
    </>
      }
      </section>
      </main>
    </>
  );
}
