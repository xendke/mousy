// import Head from 'next/head'
// import { PostDiscussion } from '~/views'
import dynamic from 'next/dynamic'

// export default function PostDiscussionPage() {
//   return <PostDiscussion />
// }

const DynamicComponentWithNoSSR = dynamic(
  () => import('~/views/PostDiscussion/PostDiscussion.jsx'),
  {
    ssr: false,
  }
)

const PostDiscussionPage = () => <DynamicComponentWithNoSSR />

export default PostDiscussionPage
