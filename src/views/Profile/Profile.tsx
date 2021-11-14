import React from 'react'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { compose } from '~/utils'

import OwnProfile from './components/OwnProfile'
import UserProfile from './components/UserProfile'
import { User } from '~/types'

const Profile: React.FC<{ user: User }> = ({ user }) => {
  const router = useRouter()
  const { userId } = router.query

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
})

export default compose(connect(mapStateToProps))(Profile)
