import React from 'react'
import { Icon } from 'semantic-ui-react'
import styles from './Footer.module.scss'

const Footer = () => (
  <footer className={styles.Footer}>
    <span>
      Made with <Icon name="heart" color="pink" /> by{' '}
      <a href="https://twitter.com/xendke" className={styles.link}>
        @xendke
      </a>
    </span>
  </footer>
)

export default Footer
