import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Helmet} from "react-helmet";
import './index.css';


ReactDOM.render(
  <React.StrictMode>
	<Helmet>
		<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
		integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
		crossorigin=""
		/>
	</Helmet>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

