import React from 'react'; // import react library
import ReactDOM from 'react-dom'; // import react dom library
import 'bootstrap/dist/css/bootstrap.min.css'; // import bootstrap css
import './index.css'; // import index css
import App from './App'; // import App component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
