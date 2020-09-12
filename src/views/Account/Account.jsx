/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import AvatarPage from './components/AvatarPage'

import './Account.scss'

const Account = ({ user }) => {
  const [currentTab, setCurrentTab] = useState('avatar')

  if (!user.isSignedIn) {
    return <Redirect to="/login" />
  }

  const tabContents = {
    avatar: <AvatarPage />,
    info: <div />,
    lol: <div />,
  }

  return (
    <div className="Account container section">
      <div className="box">
        <div className="tabs">
          <ul>
            <li className={currentTab === 'avatar' ? 'is-active' : null}>
              <a
                onClick={() => setCurrentTab('avatar')}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentTab('avatar')
                }}
                tabIndex="0"
              >
                Avatar
              </a>
            </li>
            <li className={currentTab === 'info' ? 'is-active' : null}>
              <a
                onClick={() => setCurrentTab('info')}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentTab('info')
                }}
                tabIndex="0"
              >
                Info
              </a>
            </li>
            <li className={currentTab === 'lol' ? 'is-active' : null}>
              <a
                onClick={() => setCurrentTab('lol')}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentTab('lol')
                }}
                tabIndex="0"
              >
                Lol
              </a>
            </li>
          </ul>
        </div>
        {tabContents[currentTab]}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(Account)
