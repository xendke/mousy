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
import { useWindowSize } from '~/utils/hooks'

interface TopNavProps {
  user: User
  firebase: Firebase
}

const TopNav: React.FC<TopNavProps> = ({ user, firebase }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { width } = useWindowSize()
  const nodeRef = useRef<HTMLElement | null>(null)
  const router = useRouter()
  const isMobile = width <= 768

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

  return (
    <nav ref={nodeRef} className={styles.TopNav}>
      <div className={styles.inner}>
        {/* Brand */}
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

        {/* Desktop actions */}
        {!isMobile && (
          <div className={styles.actions}>
            {user.isSignedIn ? (
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
            ) : (
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
            )}
          </div>
        )}

        {/* Mobile burger */}
        {isMobile && (
          <button
            type="button"
            className={styles.burger}
            aria-label="menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Icon name={isMenuOpen ? 'close' : 'bars'} size="large" />
          </button>
        )}
      </div>

      {/* Mobile drawer */}
      {isMobile && isMenuOpen && (
        <div className={styles.drawer}>
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
      )}
    </nav>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(withFirebase(TopNav))
