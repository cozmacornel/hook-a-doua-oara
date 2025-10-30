import React, { useState } from 'react';
import './App.css';
import useLocalStorage from './components/useLocalStorage';
import useWindowsSize from './components/useWindowsSize';
import useToggle from './components/useToggle';
import Dashboard from './components/Dashboard';
import useFetch from './components/useFetch';
import useDebounce from './components/useDebounce';

function App() {
  const [currentExample, setCurrentExample] = useState('dashboard');
  const [savedName, setSavedName]=useLocalStorage('name', '');
  const { width, isMobile, isTablet, isDesktop } = useWindowsSize();
  const [isDarkMode, toggleDarkMode]=useToggle();
  return(
    <div style={{
      backgroundColor: isDarkMode ? '#333' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <nav style={{
        padding: '20px',
        borderBottom:'2px solid #ddd',
        marginBottom:'20px'
      }}>
        <button onClick={() => setCurrentExample('dashboard')}>Dashboard</button>
        <button onClick={() => setCurrentExample('localStorage')}>useLocalStorage</button>
        <button onClick={() => setCurrentExample('fetch')}>useFetch</button>
        <button onClick={() => setCurrentExample('debounce')}>useDebounce</button>
        <button>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        

      </nav>
      <div style={{
        padding:'10px 20px',
        backgroundColor: isDarkMode ? '#444' : '#f9f9f9',
        marginBottom:'20px',
        }}>
          <p>Latime ecran: {width}px| {isMobile ? 'Mobil' : 'Desktop'}</p>
        {savedName && <p>Nume salvat: {savedName}!</p>}
      </div>
      {currentExample==='dashboard' && <Dashboard />}
      {currentExample==='localStorage' && (
        <div>
          <h2>useLocalStorage Example</h2>
          <input 
            type="text" 
            value={savedName} 
            onChange={e => setSavedName(e.target.value)} 
            placeholder="Enter your name"
            style={{padding:'10px', fontSize:'16px'}}
          />
          <p>Your name is saved in localStorage!</p>
        </div>
      )}
      {currentExample==='fetch' && (
        <div>
          <h2>useFetch Example</h2>
          <FetchExample />
        </div>
      )}
      {currentExample==='debounce' && (
        <div>
          <h2>useDebounce Example</h2>
          <DebounceExample />
        </div>
      )}
    </div>
  )
}
function FetchExample() {
  const { posts, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users/1');
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <h3>Date utilizator:</h3>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </div>
  )
}
function DebounceExample() {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500);
  
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tastează ceva..."
      />
      <p>Valoare instant: {value}</p>
      <p>Valoare debounced (după 500ms): {debouncedValue}</p>
    </div>
  );
}
  
    
export default App;