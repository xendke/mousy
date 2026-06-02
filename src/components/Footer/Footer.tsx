import React from 'react'
import { Heart } from 'lucide-react'

const Footer = () => (
  <footer className="bg-white border-t-2 border-black py-5 text-center text-sm text-black">
    Made with <Heart className="inline h-4 w-4 text-pink-400 fill-pink-400 mx-1" /> by{' '}
    <a href="https://twitter.com/xendke" className="text-black font-bold hover:underline">
      @xendke
    </a>
  </footer>
)

export default Footer
