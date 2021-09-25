import React from 'react'
import Link from 'next/link'

import styles from './Empty.module.scss'

const Action = ({ link, label }) => (
  <Link href={link} className="card-footer-item">
    {label}
  </Link>
)

const Empty = ({ message, actions }) => (
  <div className={`${styles.Empty} ${styles.card}`}>
    <div className="card-content">
      <div className="content">{message}</div>
    </div>
    {actions && <footer className="card-footer">{actions}</footer>}
  </div>
)

export { Action }
export default Empty
