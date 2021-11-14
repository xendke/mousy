import React, { useEffect } from 'react'
import { useRouter, withRouter } from 'next/router'
import { connect } from 'react-redux'
import { compose } from '~/utils'

import OwnProfile from './components/OwnProfile'
import UserProfile from './components/UserProfile'

const Profile = ({ user }) => {
  const router = useRouter()
  const { userId } = router.query

  useEffect(() => {
    // check auth
  }, [])

  if (userId) {
    return <UserProfile userId={userId} />
  }
  if (user.auth) {
    return <OwnProfile />
  }
  return null
}

const mapStateToProps = (state) => ({
  user: state.user,
  userbase: state.userbase,
})

export default compose(connect(mapStateToProps), withRouter)(Profile)

// TODO: rewrite so that there are two parent components
// OwnProfile, UserProfile
// both render Profile but they fetch the correct info and pass down correct props
// maybe use a custom hook? RIP refract

// problem: Figure out how to render OwnProfile vs UserProfile
// maybe, if userId avail render UserProfile
// maybe a prop passed by me.js

// Composition
// Profile Container Component
//   renders either of 2 children depending on url
// 1. OwnProfile -- effects for own
// 2. UserProfile -- effects for other user
// Both components will render a 4th component
//   ProfileView - takes all the props and renders view
