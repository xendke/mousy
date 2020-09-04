import React from 'react'
import { Link } from 'react-router-dom'

const styles = {
  margin: '5px 0px 25px',
  textAlign: 'center',
}

const Footer = () => (
  <footer style={styles}>
    Made with ♥ by&nbsp;
    <Link to="https://twitter.com/xendke" className="has-text-black-ter">
      @xendke
    </Link>
  </footer>
)

export default Footer
