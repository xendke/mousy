/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { NextRouter, withRouter } from 'next/router'
import cn from 'classnames'
import { compose } from '~/utils'
import AvatarTab from './components/AvatarTab'
import InfoTab from './components/InfoTab'
import InterestsTab from './components/InterestsTab'
import { User } from '~/types'

import styles from './Account.module.scss'

interface AccountProps {
  user: User
  router: NextRouter
}

const Account: React.FC<AccountProps> = ({ user, router }) => {
  const { query } = router
  const tab = query.tab ? query.tab[0] : ''
  const tabContents = {
    avatar: <AvatarTab />,
    info: <InfoTab />,
    interests: <InterestsTab />,
  }

  let currentTab = 'avatar'
  if (Object.keys(tabContents).includes(tab)) currentTab = tab

  const setCurrentTab = (target: string) => router.push(`/account/${target}`)

  useEffect(() => {
    if (!user.isSignedIn) {
      router.push('/login')
    }
  }, [router, user.isSignedIn])

  return (
    <div className={cn(styles.Account, styles.container, 'container section')}>
      <div className={cn(styles.box, 'box')}>
        <div className={cn(styles.tabs, 'tabs')}>
          <ul>
            <li
              className={cn(
                currentTab === 'avatar' && 'is-active',
                currentTab === 'avatar' && styles.active
              )}
            >
              <a
                onClick={() => setCurrentTab('avatar')}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentTab('avatar')
                }}
                tabIndex={0}
              >
                Avatar
              </a>
            </li>
            <li
              className={cn(
                currentTab === 'info' && 'is-active',
                currentTab === 'info' && styles.active
              )}
            >
              <a
                onClick={() => setCurrentTab('info')}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentTab('info')
                }}
                tabIndex={0}
              >
                Info
              </a>
            </li>
            <li
              className={cn(
                currentTab === 'interests' && 'is-active',
                currentTab === 'interests' && styles.active
              )}
            >
              <a
                onClick={() => setCurrentTab('interests')}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentTab('interests')
                }}
                tabIndex={0}
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
