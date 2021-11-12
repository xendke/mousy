import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('~/views/Profile/Profile'),
  {
    ssr: false,
  }
)

const ProfilePage = () => <DynamicComponentWithNoSSR />

export default ProfilePage
