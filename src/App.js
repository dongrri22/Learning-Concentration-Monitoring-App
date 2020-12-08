import React, { Component } from 'react';
import Navigation from './page/Navigation';
import Main from './page/Main';
import Monitor from './page/Monitor';
import Check from './page/Check';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default function App() {
  return (
    <div className="App"> 
      <Navigation />
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/Monitor" component={Monitor} />
          <Route path="/Check" component={Check} />
        </Switch>
      </BrowserRouter>      
    </div> 
  );  
}