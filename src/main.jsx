import React from 'react';
import ReactDOM from 'react-dom/client';
import Velorah from './Velorah.jsx';
import './velorah.css';

// Construction page = the Velorah hero (uilora) with the launch countdown.
// The previous globe page (App.jsx + index.css) is kept in the repo for revert.
ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <Velorah />
  </React.StrictMode>,
);
