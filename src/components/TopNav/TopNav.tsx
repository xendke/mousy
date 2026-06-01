import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { connect } from 'react-redux'
import { Menu, X, UserCircle, LogOut, LogIn, UserPlus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { withFirebase } from '~/components/firebase'
import logoImage from '~/assets/logo.png'
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
        <Button variant="ghost" size="sm" onClick={closeAndGo('/me')}>
          <UserCircle className="h-4 w-4" />
          Profile
        </Button>
      )}
      <Button
        size="sm"
        onClick={() => firebase.doSignOut().then(() => router.push('/'))}
      >
        Log Out
      </Button>
    </>
  )

  const signedOutActions = (
    <>
      <Button variant="ghost" size="sm" onClick={closeAndGo('/login')}>
        Log in
      </Button>
      <Button size="sm" onClick={closeAndGo('/join')}>
        Sign up free
      </Button>
    </>
  )

  return (
    <nav ref={nodeRef} className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pastel-lavender/60">
      <div className="flex items-center justify-between max-w-5xl mx-auto px-6 py-3">
        <Link href="/" className="flex items-center">
          <Image src={logoImage} alt="Mousy" height={32} className="h-8 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user.isSignedIn ? signedInActions : signedOutActions}
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          className="md:hidden p-1 text-gray-500"
          aria-label="menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white py-2">
          {user.isSignedIn ? (
            <>
              <button type="button" className="flex w-full items-center gap-3 px-6 py-3 text-left text-gray-700 hover:bg-pastel-lavender" onClick={closeAndGo('/me')}>
                <UserCircle size={18} className="text-brand" /> Profile
              </button>
              <button type="button" className="flex w-full items-center gap-3 px-6 py-3 text-left text-gray-700 hover:bg-pastel-lavender" onClick={() => { firebase.doSignOut().then(() => { router.push('/'); setIsMenuOpen(false) }) }}>
                <LogOut size={18} className="text-brand" /> Log Out
              </button>
            </>
          ) : (
            <>
              <button type="button" className="flex w-full items-center gap-3 px-6 py-3 text-left text-gray-700 hover:bg-pastel-lavender" onClick={closeAndGo('/login')}>
                <LogIn size={18} className="text-brand" /> Log in
              </button>
              <button type="button" className="flex w-full items-center gap-3 px-6 py-3 text-left text-gray-700 hover:bg-pastel-lavender" onClick={closeAndGo('/join')}>
                <UserPlus size={18} className="text-brand" /> Sign up free
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

const mapStateToProps = (state) => ({ user: state.user })
export default connect(mapStateToProps)(withFirebase(TopNav))
