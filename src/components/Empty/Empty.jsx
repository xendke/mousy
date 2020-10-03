import React from 'react'
import { Link } from 'react-router-dom'

import './Empty.scss'

const Action = ({ link, label }) => (
  <Link to={link} className="card-footer-item">
    {label}
  </Link>
)

const Empty = ({ message, actions }) => (
  <div className="Empty card">
    <div className="card-content">
      <div className="content">{message}</div>
    </div>
    <footer className="card-footer">{actions}</footer>
  </div>
)

export { Action }
export default Empty
