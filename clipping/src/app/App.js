import React, { Component } from 'react';
import {
  Route
} from 'react-router-dom';

import Clipping from '../clipping/Clipping';

import { API_BASE_URL } from '../constants';

import { Helmet } from 'react-helmet';
import './styles/App.css';
import Axios from 'axios';

/**
 * Classe responsavel por renderizar a pagina solicitada
 */
class App extends Component {
  constructor(props) {
    super(props);
    Axios.defaults.baseURL = API_BASE_URL;
  }

  render() {
    return (
      <div className="app">
        <Helmet htmlAttributes={{ lang: 'pt-br' }}>
          <meta charSet="utf-8" />
        </Helmet>
        <div className="app-top-box"></div>
        <div className="app-body"></div>
        <div className="app-bot-box">
          <Route exact path="/doc" render={() => {window.location.href="doc.html"}} />
          <Route component={Clipping}></Route>
        </div>
       
      </div>
    );
  }
}

export default App;
