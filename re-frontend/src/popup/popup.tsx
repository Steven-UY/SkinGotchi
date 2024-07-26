import React from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';

const test = (
  <div className = "container">
    <div className = "header">
      <img className = "logo" src="icon.png" alt="Skingotchi" />
      <h1 className= "title">Skingotchi</h1>
    </div>
    <div className="separator"></div> {/* Separator line */}
    <p className="blurb">Log Into Skingotchi</p>
    <form className = "login">
      <input type="text" placeholder="Username" className="input" />
      <input type="password" placeholder="Password" className="input" />
      <button type="submit" className="button">Log In</button>
    </form>
  </div>
);

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(test);