import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { connect } from 'react-redux'
import { Eye, EyeOff, Mail, KeyRound } from 'lucide-react'
import { withFirebase } from '~/components/firebase'
import isValidEmail from '~/utils/validation'
import { Firebase, User } from '~/types'

const GRADIENT = 'linear-gradient(180deg,#ece7fa 0%,#e6effc 38%,#fbeede 78%,#fde9ea 100%)'

const fieldBox: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  border: '2px solid #0c0c0c', borderRadius: 14,
  padding: '0 14px', height: 52, background: '#fff',
}

interface LoginProps {
  user: User
  firebase: Firebase
}

const Login: React.FC<LoginProps> = ({ user, firebase }) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  useEffect(() => {
    if (user.isSignedIn) Router.push('/')
  }, [user.isSignedIn])

  return (
    <div
      className="flex items-center justify-center px-4 py-10"
      style={{ minHeight: 'calc(100vh - 74px)', background: GRADIENT }}
    >
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', border: '2px solid #0c0c0c', borderRadius: 26, overflow: 'hidden' }}>
        <div style={{ padding: '36px 38px 34px' }}>

          {/* Tab switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, background: '#fff', border: '2px solid #0c0c0c', borderRadius: 999, padding: 5, marginBottom: 24 }}>
            <div style={{ background: '#0c0c0c', color: '#fff', fontWeight: 700, fontSize: 15, padding: '10px 0', borderRadius: 999, textAlign: 'center' }}>
              Log in
            </div>
            <Link href="/join" style={{ color: '#6b7280', fontWeight: 700, fontSize: 15, padding: '10px 0', borderRadius: 999, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              Sign up
            </Link>
          </div>

          <h1 style={{ fontFamily: '"Archivo", sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-0.01em', lineHeight: 1.05, color: '#181f2a' }}>
            Welcome back
          </h1>
          <p style={{ color: '#6b7280', fontSize: 15, marginTop: 8, marginBottom: 24 }}>
            Log in to find your people.
          </p>

          <form>
            {/* Email */}
            <label style={{ display: 'block', marginBottom: 16 }}>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#181f2a', marginBottom: 7 }}>Email</span>
              <div style={fieldBox}>
                <Mail size={20} color="#9aa0aa" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmailError(undefined); setErrorMessage(undefined); setEmail(e.target.value) }}
                  style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 16, color: '#181f2a', background: 'transparent' }}
                />
              </div>
              {emailError && <p style={{ marginTop: 4, fontSize: 12, color: '#ef4444' }}>{emailError}</p>}
            </label>

            {/* Password */}
            <label style={{ display: 'block', marginBottom: 4 }}>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#181f2a', marginBottom: 7 }}>Password</span>
              <div style={fieldBox}>
                <KeyRound size={20} color="#9aa0aa" style={{ flexShrink: 0 }} />
                <input
                  type={isPasswordHidden ? 'password' : 'text'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPasswordError(undefined); setErrorMessage(undefined); setPassword(e.target.value) }}
                  style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 16, color: '#181f2a', background: 'transparent' }}
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsPasswordHidden(!isPasswordHidden)}
                    style={{ display: 'flex', color: '#9aa0aa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {isPasswordHidden ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                )}
              </div>
              {passwordError && <p style={{ marginTop: 4, fontSize: 12, color: '#ef4444' }}>{passwordError}</p>}
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '8px 0 22px' }}>
              <span style={{ color: '#181f2a', fontWeight: 600, fontSize: 13.5, borderBottom: '1.5px solid rgba(12,12,12,.25)', cursor: 'default' }}>
                Forgot password?
              </span>
            </div>

            {errorMessage && (
              <p style={{ color: '#ef4444', fontSize: 14, marginBottom: 16 }}>{errorMessage}</p>
            )}

            <button
              type="submit"
              style={{ background: '#0c0c0c', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 999, height: 54, width: '100%', cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault()
                let hasError = false
                if (!isValidEmail(email)) { setEmailError('Invalid email'); hasError = true }
                if (password.length < 1) { setPasswordError('Password cannot be empty.'); hasError = true }
                if (hasError) return
                firebase.doSignInWithEmailAndPassword(email, password).catch((err) => setErrorMessage(err.message))
              }}
            >
              Log in
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, marginTop: 20 }}>
            New to Mousy?{' '}
            <Link href="/join" style={{ color: '#181f2a', fontWeight: 800, borderBottom: '1.5px solid #0c0c0c', textDecoration: 'none' }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({ user: state.user })
export default connect(mapStateToProps)(withFirebase(Login))
