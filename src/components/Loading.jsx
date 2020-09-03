import React from 'react'
import './Loading.scss'

const Loading = () => (
  <div className="Loading">
    <div className="box">
      <progress
        className="progress is-small is-primary is-inverted"
        max="100"
      />
    </div>
  </div>
)

export default Loading
