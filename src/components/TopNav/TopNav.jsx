import React, { useState, useRef, useEffect } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { connect, useDispatch } from 'react-redux'

import { signIn, signOut, setInfo } from '~/redux/actions/user'
import { withFirebase } from '~/components/firebase'
import iconImage from '~/assets/icon.png'
import logoImage from '~/assets/logo.png'

import styles from './TopNav.module.scss'

const TopNav = ({ user, firebase }) => {
  const [isNavbarOpened, setIsNavbarOpened] = useState(false)
  const nodeRef = useRef()
  const router = useRouter()
  const dispatch = useDispatch()

  const closeNavbarAndGo = (path) => () => {
    setIsNavbarOpened(false)
    router.push(path)
  }

  const toggleNavbar = () => {
    setIsNavbarOpened(!isNavbarOpened)
  }

  const closeOnOutsideClick = (event) => {
    if (!nodeRef.current.contains(event.target)) {
      setIsNavbarOpened(false)
    }
  }

  useEffect(() => {
    if (isNavbarOpened) {
      document.addEventListener('mousedown', closeOnOutsideClick)
    } else {
      document.removeEventListener('mousedown', closeOnOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
    }
  }, [isNavbarOpened])

  // useEffect(() => {
  //   if (!firebase) return

  //   const unsubscribe = firebase.auth.onAuthStateChanged(async (authUser) => {
  //     if (authUser) {
  //       dispatch(signIn(authUser))
  //       const userInfo = await firebase.doUserInfoGet(authUser.uid)
  //       dispatch(setInfo(userInfo.data()))
  //     } else {
  //       dispatch(signOut())
  //     }
  //   })

  //   return () => unsubscribe()
  // }, [firebase])

  return (
    <nav
      ref={nodeRef}
      className={cn(styles.TopNav, 'navbar')}
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <div className={cn(styles.navbarItem, 'navbar-item')}>
          <Link href="/">
            <a>
              <Image
                src={iconImage}
                alt="ShyApp Icon"
                className={cn(styles.navbarIcon, 'navbar-icon')}
              />
              <Image
                src={logoImage}
                alt="ShyApp Logo"
                className={cn(styles.navbarLogo, 'navbar-logo')}
              />
            </a>
          </Link>
        </div>

        <button
          type="button"
          className={cn(
            styles.navbarBurger,
            'navbar-burger',
            'burger',
            isNavbarOpened && 'is-active'
          )}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarButtons"
          onClick={toggleNavbar}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div
        id="navbarButtons"
        className={cn(
          styles.navbarMenu,
          isNavbarOpened && styles.isActive,
          'navbar-menu',
          isNavbarOpened && 'is-active'
        )}
      >
        <div className="navbar-end">
          <div className={cn(styles.navbarItem, 'navbar-item')}>
            <div className="buttons">
              {user.isSignedIn && (
                <>
                  {!router.pathname.includes('/me') && (
                    <button
                      type="button"
                      className="button is-primary is-inverted is-outlined"
                      onClick={closeNavbarAndGo('/me')}
                    >
                      Profile
                    </button>
                  )}
                  <button
                    type="button"
                    className="button is-primary is-inverted"
                    onClick={() => {
                      toggleNavbar()
                      firebase.doSignOut().then(() => {
                        router.push('/')
                      })
                    }}
                  >
                    Log Out
                  </button>
                </>
              )}
              {!user.isSignedIn && (
                <>
                  <button
                    onClick={closeNavbarAndGo('/join')}
                    type="button"
                    className="button is-primary is-inverted"
                  >
                    Sign up
                  </button>
                  <button
                    onClick={closeNavbarAndGo('/login')}
                    type="button"
                    className="button is-primary is-inverted is-outlined"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withFirebase(TopNav))
