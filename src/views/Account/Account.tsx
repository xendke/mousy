/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { NextRouter, withRouter } from 'next/router'
import { compose } from '~/utils'
import AvatarTab from './components/AvatarTab'
import InfoTab from './components/InfoTab'
import InterestsTab from './components/InterestsTab'
import { User } from '~/types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'

interface AccountProps {
  user: User
  router: NextRouter
}

const Account: React.FC<AccountProps> = ({ user, router }) => {
  const { query } = router
  const tab = query.tab ? query.tab[0] : ''

  const validTabs = ['avatar', 'info', 'interests']
  let currentTab = 'avatar'
  if (validTabs.includes(tab)) currentTab = tab

  const setCurrentTab = (target: string) => router.push(`/account/${target}`)

  useEffect(() => {
    if (!user.isSignedIn) {
      router.push('/login')
    }
  }, [router, user.isSignedIn])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
        </TabsList>
        <TabsContent value="avatar">
          <AvatarTab />
        </TabsContent>
        <TabsContent value="info">
          <InfoTab />
        </TabsContent>
        <TabsContent value="interests">
          <InterestsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default compose(connect(mapStateToProps), withRouter)(Account)
