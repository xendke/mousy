import { useEffect } from 'react'
import Router from 'next/router'

export default function ScrollToTop() {
  useEffect(() => {
    Router.events.on('routeChangeComplete', () => {
      // window.scroll({
      //   top: 0,
      //   left: 0,
      //   behavior: 'smooth'
      // });
      window.scrollTo(0, 0)
    })
  }, [])

  return null
}
