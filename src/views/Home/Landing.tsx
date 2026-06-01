import React from 'react'
import Link from 'next/link'
import { Users, MessageCircle, Heart, Shield, Zap, Star, ArrowRight } from 'lucide-react'
import { Button } from '~/components/ui/button'
import styles from './Landing.module.scss'

const featureIcons = {
  users: Users,
  comments: MessageCircle,
  heart: Heart,
  shield: Shield,
}

const features = [
  {
    icon: 'users',
    title: 'Find Your People',
    desc: 'Connect with others who share your passions, hobbies, and values — not just mutual followers.',
    bg: 'bg-pastel-lavender',
  },
  {
    icon: 'comments',
    title: 'Real Conversations',
    desc: 'Engage in meaningful discussions without the noise of algorithms pushing engagement bait.',
    bg: 'bg-pastel-mint',
  },
  {
    icon: 'heart',
    title: 'Interest-Based Feed',
    desc: 'Your feed is curated by what you actually care about, not by what keeps you scrolling.',
    bg: 'bg-pastel-peach',
  },
  {
    icon: 'shield',
    title: 'Your Space, Your Rules',
    desc: 'No ads, no tracking. A community built for humans, not engagement metrics.',
    bg: 'bg-pastel-sky',
  },
]

const stats = [
  { value: '100%', label: 'Ad free' },
  { value: 'You', label: 'In control' },
  { value: '∞', label: 'Interests' },
  { value: '1', label: 'Community' },
]

const Landing = () => (
  <div className="overflow-x-hidden font-sans">
    {/* Hero */}
    <section className="relative bg-gradient-to-br from-pastel-lavender via-pastel-sky to-white py-28 px-6 text-center overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white border-2 border-black rounded-full px-4 py-1.5 text-sm font-bold text-black mb-6">
          <Star className="h-3 w-3" />
          <span>A social network built different</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
          Connect with{' '}
          <span className="text-black underline decoration-black/30 underline-offset-4">humans,</span>
          <br />
          not numbers.
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Mousy brings you closer to people who truly get you. Share your thoughts, discover your tribe, and have conversations that actually matter.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/join">
            <Button size="lg">Get Started — it&apos;s free</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">Log in</Button>
          </Link>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </div>
    </section>

    {/* Stats */}
    <section className="bg-white py-14 px-6 border-t-2 border-b-2 border-black">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map(({ value, label }) => (
          <div key={label}>
            <div className="text-4xl font-extrabold text-black">{value}</div>
            <div className="text-xs uppercase tracking-widest text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="bg-gray-50 py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white border-2 border-black rounded-full px-4 py-1.5 text-xs font-bold text-black uppercase tracking-wider mb-5">
          <Zap className="h-3 w-3" />
          <span>What we offer</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-12">
          A community designed around&nbsp;
          <span className="text-black underline decoration-black/30 underline-offset-4">real people.</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-5 text-left">
          {features.map(({ icon, title, desc, bg }) => {
            const Icon = featureIcons[icon] || Users
            return (
              <div key={title} className="flex items-start gap-4 rounded-2xl p-7 bg-white border-2 border-black transition-transform hover:-translate-y-1">
                <div className="shrink-0 h-12 w-12 bg-black rounded-xl flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>

    {/* CTA Banner */}
    <section className="bg-gradient-to-r from-pastel-peach to-pastel-pink py-20 px-6 text-center">
      <div className="max-w-xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Ready to find your people?</h2>
        <p className="text-lg text-gray-500 mb-10 leading-relaxed">
          Join Mousy today. No algorithm, no ads — just genuine connections.
        </p>
        <Link href="/join">
          <Button size="lg">
            Create your account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  </div>
)

export default Landing
