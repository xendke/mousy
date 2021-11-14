import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('~/views/PostDiscussion/PostDiscussion'),
  {
    ssr: false,
  }
)

const PostDiscussionPage = () => <DynamicComponentWithNoSSR />

export default PostDiscussionPage
