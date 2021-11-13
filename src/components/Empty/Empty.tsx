import React from 'react'
import Link from 'next/link'
import cn from 'classnames'

import styles from './Empty.module.scss'

interface ActionProps {
  link: string
  label: string
}

export const Action: React.FC<ActionProps> = ({ link, label }) => (
  <Link href={link} passHref>
    <a href="wow" className="card-footer-item">
      {label}
    </a>
  </Link>
)

interface EmptyProps {
  message: string
  actions?: React.ReactNode
}

const Empty: React.FC<EmptyProps> = ({ message, actions }) => (
  <div className={cn(styles.Empty, styles.card, 'card')}>
    <div className="card-content">
      <div className="content">{message}</div>
    </div>
    {actions && <footer className="card-footer">{actions}</footer>}
  </div>
)

Empty.defaultProps = {
  actions: null,
}

export default Empty
