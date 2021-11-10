// import Head from 'next/head'
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('~/views/PostDiscussion/PostDiscussion.jsx'),
  {
    ssr: false,
  }
)

const PostDiscussionPage = () => <DynamicComponentWithNoSSR />

export default PostDiscussionPage
