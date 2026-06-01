import React from 'react'
import { Heart } from 'lucide-react'

const Footer = () => (
  <footer className="border-t border-gray-100 py-5 text-center text-sm text-gray-500">
    Made with <Heart className="inline h-4 w-4 text-pink-400 fill-pink-400 mx-1" /> by{' '}
    <a href="https://twitter.com/xendke" className="text-brand font-medium hover:underline">
      @xendke
    </a>
  </footer>
)

export default Footer
