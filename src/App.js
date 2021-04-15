import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import './App.css';
import moment from 'moment';
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
    editMode: false
  });

  useEffect(() => {
  async function getAppData() {
    if(!state.user) return;
    const BASE_URL = `https://videoblog-backend.herokuapp.com/api/videoblogs?uid=${state.user.uid}`;
    const videoblogs = await fetch(BASE_URL).then(res => res.json());
    setState((prevState) => ({
      ...prevState,
      videoblogs,
    }))
  }

  
    getAppData();
    const cancelSubscription = auth.onAuthStateChanged(user => {
      if(user) {
        setState(prevState => ({
          ...prevState,
          user,
        }))
      } else {
        setState(prevState => ({
          ...prevState,
          user,
        }))
      }
    });

      return function() {
        cancelSubscription();
      }

  }, [state.user]);


  async function handleSubmit(e) {
    if(!state.user) return;

    e.preventDefault();

    const BASE_URL = 'https://videoblog-backend.herokuapp.com/api/videoblogs';

    if(!state.editMode) {
    
      const videoblogs = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify({...state.newBlog, uid: state.user.uid })
      }).then(res => res.json());
      setState((prevState) => ({
      ...prevState,
      videoblogs,
      newBlog: {
        name: '',
        poster: '',
        author: state.user.displayName,
        rating: '1',
        date: '',
        howtoenjoy: '',
      },
      }));
    } else {
      const { name, poster, rating, howtoenjoy, _id } = state.newBlog;

      const videoblogs = await fetch(`${BASE_URL}/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'Application/json'
        },
        body: JSON.stringify({ name, poster, rating, howtoenjoy })
      }).then(res => res.json());

      setState(prevState => ({
        ...prevState,
        videoblogs,
        newBlog: {
          name: '',
          poster: '',
          author: '',
          rating: '1',
          date: '',
          howtoenjoy: ''
        },
        editMode: false
      }));
    }
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

  async function handleDelete(videoblogId) {
    if(!state.user) return;
    const URL = `https://videoblog-backend.herokuapp.com/api/videoblogs/${videoblogId}`
    const videoblogs = await fetch(URL, {
      method: 'DELETE'
    }).then(res => res.json());

    setState(prevState => ({
      ...prevState,
      videoblogs,
    }))
  }

  function handleEdit(videoblogId) {
    const { name, poster, rating, howtoenjoy, _id } = state.videoblogs.find(videoblog => videoblog._id === videoblogId);
    setState(prevState => ({
      ...prevState,
      newBlog: {
        name,
        poster,
        rating,
        howtoenjoy,
        _id
      },
      editMode: true
    }));
  }

  function handleCancel() {
    setState(prevState => ({
      ...prevState,
      newBlog: {
        name: '',
        poster: '',
        author: '',
        rating: '1',
        date: '',
        howtoenjoy: ''
      },
      editMode: false
    }))
  }

  return (
    <>
      <Header user={state.user} />
      <br/><br/>
      <main>
        <section>
          {state.videoblogs.map((v) => (
            <article className='blog-container' key={v.videoblog}>
              <div className='name'>{v.name}</div>
              <br/>
              <div><img className='imgs' src={v.poster} alt='poster' /></div>
              <br/>
              <div><strong>Author:</strong> {v.author}</div>
              <br/>
              <div><strong>Rating:</strong> {v.rating}</div>
              <br/>
              <div><strong>Created:</strong> {moment(v.date).format('MM-DD-YYYY')}</div>
              <br/>
              <div><strong>Tips to Enjoy:</strong> {v.howtoenjoy}</div>
              <br/>
              <div onClick={() => handleDelete(v._id)} className='delete'>{'🗑'}</div> <br/>{ !state.editMode && <div onClick={() => handleEdit(v._id)} className='update'>{'🖌'}</div>}
              <br/><br/><br/>
            </article>
          ))}
          <hr />
          
        
      {
        state.user &&
        <>
    <form onSubmit={handleSubmit}>
          <label>
            <span>Game Name </span>
            <input name='name' value={state.newBlog.name} onChange={handleChange} />
          </label>
          <br/>
          <label>
            <span>    Poster Link </span>
            <input name='poster' value={state.newBlog.poster} onChange={handleChange} />
          </label>
          <br/>
          
          <br/>
          <label>
            <span>Rating </span>
            <select name='rating' value={state.newBlog.rating} onChange={handleChange} >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          <br/>
          <label>
            <span>How to Enjoy </span>
            <textarea name='howtoenjoy' value={state.newBlog.howtoenjoy} onChange={handleChange}></textarea>
          </label>
          <br/><br/>
          <button>{state.editMode ? 'Edit Blog' : 'Add Videogame Blog' }</button>
          <br/><br/>
          { state.editMode && <button onClick={handleCancel} className='cancel' >Cancel</button> }
    </form>
    
    </>
      }
      </section>
      </main>
    </>
  );
}