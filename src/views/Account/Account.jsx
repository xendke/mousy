/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'next/router'
import { compose } from '~/utils'
import AvatarTab from './components/AvatarTab'
import InfoTab from './components/InfoTab'
import InterestsTab from './components/InterestsTab'

import styles from './Account.module.scss'

const Account = ({ user, router }) => {
  const { query } = router
  const tab = query.tab ? query.tab[0] : ''
  const tabContents = {
    avatar: <AvatarTab />,
    info: <InfoTab />,
    interests: <InterestsTab />,
  }

  let currentTab = 'avatar'
  if (Object.keys(tabContents).includes(tab)) currentTab = tab

  const setCurrentTab = (tab) => router.push(`/account/${tab}`)

  useEffect(() => {
    if (!user.isSignedIn) {
      return router.push('/login')
    }
  }, [])

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
            <li className={currentTab === 'interests' ? 'is-active' : null}>
              <a
                onClick={() => setCurrentTab('interests')}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentTab('interests')
                }}
                tabIndex="0"
              >
                Interests
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

export default compose(connect(mapStateToProps), withRouter)(Account)
