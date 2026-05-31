import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { connect } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'

import { withFirebase } from '~/components/firebase'
import logoImage from '~/assets/logo.png'

import styles from './TopNav.module.scss'
import { Firebase, User } from '~/types'

interface TopNavProps {
  user: User
  firebase: Firebase
}

const TopNav: React.FC<TopNavProps> = ({ user, firebase }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const nodeRef = useRef<HTMLElement | null>(null)
  const router = useRouter()

  const closeAndGo = (path: string) => () => {
    setIsMenuOpen(false)
    router.push(path)
  }

  const closeOnOutsideClick = (event) => {
    if (nodeRef.current && !nodeRef.current.contains(event.target)) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', closeOnOutsideClick)
    } else {
      document.removeEventListener('mousedown', closeOnOutsideClick)
    }
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [isMenuOpen])

  const signedInActions = (
    <>
      {!router.pathname.includes('/me') && (
        <Button
          basic
          circular
          size="small"
          onClick={closeAndGo('/me')}
          className={styles.ghostBtn}
        >
          <Icon name="user circle" />
          Profile
        </Button>
      )}
      <Button
        size="small"
        className={styles.primaryBtn}
        onClick={() => {
          firebase.doSignOut().then(() => router.push('/'))
        }}
      >
        Log Out
      </Button>
    </>
  )

  const signedOutActions = (
    <>
      <Button
        basic
        circular
        size="small"
        className={styles.ghostBtn}
        onClick={closeAndGo('/login')}
      >
        Log in
      </Button>
      <Button
        size="small"
        className={styles.primaryBtn}
        onClick={closeAndGo('/join')}
      >
        Sign up free
      </Button>
    </>
  )

  return (
    <nav ref={nodeRef} className={styles.TopNav}>
      <div className={styles.inner}>
        <Link href="/" passHref legacyBehavior>
          <a href="/" className={styles.brand}>
            <Image
              src={logoImage}
              alt="Mousy"
              height={32}
              className={styles.logo}
            />
          </a>
        </Link>

        {/* Desktop actions — hidden on mobile via CSS */}
        <div className={styles.desktopActions}>
          {user.isSignedIn ? signedInActions : signedOutActions}
        </div>

        {/* Mobile burger — hidden on desktop via CSS */}
        <button
          type="button"
          className={styles.burger}
          aria-label="menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Icon name={isMenuOpen ? 'close' : 'bars'} size="large" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`${styles.drawer} ${isMenuOpen ? styles.drawerOpen : ''}`}
      >
        {user.isSignedIn ? (
          <>
            <button
              type="button"
              className={styles.drawerItem}
              onClick={closeAndGo('/me')}
            >
              <Icon name="user circle" /> Profile
            </button>
            <button
              type="button"
              className={styles.drawerItem}
              onClick={() => {
                firebase.doSignOut().then(() => {
                  router.push('/')
                  setIsMenuOpen(false)
                })
              }}
            >
              <Icon name="sign out" /> Log Out
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={styles.drawerItem}
              onClick={closeAndGo('/login')}
            >
              <Icon name="sign in" /> Log in
            </button>
            <button
              type="button"
              className={styles.drawerItem}
              onClick={closeAndGo('/join')}
            >
              <Icon name="add user" /> Sign up free
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(withFirebase(TopNav))
