import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { withFirebase } from '../../components/firebase'

import './Account.scss'

const Account = ({ user }) => {
  console.log(user)

  if (!user.isSignedIn) {
    return <Redirect to="/login" />
  }
  return (
    <div className="Account container">
      <div className="box">Account</div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(withFirebase(Account))
