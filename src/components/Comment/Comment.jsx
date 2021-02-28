import React from 'react'
// import xs from 'xstream'
import { connect } from 'react-redux'
// import { withEffects, toProps } from 'refract-xstream'
// import { withFirebase } from '~/components/firebase'
import { compose } from '~/utils'
// import { Post, Loading } from '~/components'

// import './PostDiscussion.scss'

const Comment = () => {
  // const { id, content, createdAt, likeCount, userId: authorId } = post
  // const author = userbase[authorId] || user.info
  return (
    <div className="box">
      <article className="media">
        <div className="media-left">
          <figure className="image is-64x64">
            {/* <img
              src="https://bulma.io/images/placeholders/128x128.png"
              alt="Image"
            /> */}
          </figure>
        </div>
        <div className="media-content">
          <div className="content">
            <p>
              <strong>John Smith</strong> <small>@johnsmith</small>{' '}
              <small>31m</small>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              efficitur sit amet massa fringilla egestas. Nullam condimentum
              luctus turpis.
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  userbase: state.userbase,
})

export default compose(
  connect(mapStateToProps)
  // withFirebase,
  // withEffects(
  //   (component, { firebase, match }) => {
  //     const { params } = match
  //     return component.mount
  //       .mapTo(xs.fromPromise(firebase.doPostGet(params.postId)))
  //       .flatten()
  //       .map((post) => toProps({ post }))
  //   },
  //   {
  //     errorHandler: () => (e) => console.log(e),
  //   }
  // )
)(Comment)
