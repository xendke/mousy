import React from 'react'
import Link from 'next/link'
import logoImage from '~/assets/logo.png'
import People from '~/assets/people.svg'

import styles from './Landing.module.scss'

const Landing = () => (
  <div className={styles.Landing}>
    <div className={`${styles.foldImage} column`}>
      <People height={500} />
    </div>
    <div className={styles.right}>
      <img src={logoImage} alt="ShyApp Logo" className={styles.logo} />

      <div className="card">
        <div className="card-content">
          <p className="title">
            In a world of algorithms, hashtags, and followers, know the true
            importance of human connections.
          </p>
          <p className="subtitle">Find people like you!</p>
        </div>
        <footer className="card-footer">
          <Link href="/join" className="card-footer-item">
            Sign up
          </Link>
          <Link href="/login" className="card-footer-item">
            Log in
          </Link>
        </footer>
      </div>
    </div>
  </div>
)

export default Landing
