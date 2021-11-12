import React from 'react'
import cn from 'classnames'
import styles from './Loading.module.scss'

const Loading = () => (
  <div className={styles.Loading}>
    <div className={cn('box', styles.box)}>
      <progress
        className="progress is-small is-primary is-inverted"
        max="100"
      />
    </div>
  </div>
)

export default Loading
