import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import cn from 'classnames'
import logoImage from '~/assets/logo.png'
import People from '~/assets/people.svg'

import styles from './Landing.module.scss'

const Landing = () => (
  <div className={styles.Landing}>
    <div className={`${styles.foldImage} column`}>
      <People width="100%" height="auto" viewBox="0 0 1200 800" />
    </div>
    <div className={styles.right}>
      <Image src={logoImage} alt="ShyApp Logo" className={styles.logo} />

      <div className={cn(styles.card, 'card')}>
        <div className="card-content">
          <p className="title">
            In a world of algorithms, hashtags, and followers, know the true
            importance of human connections.
          </p>
          <p className="subtitle">Find people like you!</p>
        </div>
        <footer className="card-footer">
          <Link href="/join" passHref>
            <a href="wow" className="card-footer-item">
              Sign up
            </a>
          </Link>
          <Link href="/login" passHref>
            <a href="wow" className="card-footer-item">
              Log in
            </a>
          </Link>
        </footer>
      </div>
    </div>
  </div>
)

export default Landing
