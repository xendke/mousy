import React from 'react'
import Link from 'next/link'
import { Button, Icon, Grid, Statistic, Container } from 'semantic-ui-react'
import styles from './Landing.module.scss'

const features = [
  {
    icon: 'users',
    title: 'Find Your People',
    desc: 'Connect with others who share your passions, hobbies, and values — not just mutual followers.',
    bg: 'lavender',
  },
  {
    icon: 'comments',
    title: 'Real Conversations',
    desc: 'Engage in meaningful discussions without the noise of algorithms pushing engagement bait.',
    bg: 'mint',
  },
  {
    icon: 'heart',
    title: 'Interest-Based Feed',
    desc: 'Your feed is curated by what you actually care about, not by what keeps you scrolling.',
    bg: 'peach',
  },
  {
    icon: 'shield',
    title: 'Your Space, Your Rules',
    desc: 'No ads, no tracking. A community built for humans, not engagement metrics.',
    bg: 'sky',
  },
]

const stats = [
  { value: '100%', label: 'Ad free' },
  { value: 'You', label: 'In control' },
  { value: '∞', label: 'Interests' },
  { value: '1', label: 'Community' },
]

const Landing = () => (
  <div className={styles.Landing}>
    {/* Hero */}
    <section className={styles.hero}>
      <Container>
        <div className={styles.heroBadge}>
          <Icon name="star" size="small" />
          <span>A social network built different</span>
        </div>
        <h1 className={styles.heroTitle}>
          Connect with <span className={styles.highlight}>humans,</span>
          <br />
          not numbers.
        </h1>
        <p className={styles.heroSub}>
          Mousy brings you closer to people who truly get you. Share your
          thoughts, discover your tribe, and have conversations that actually
          matter.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/join" passHref legacyBehavior>
            <Button as="a" size="large" className={styles.primaryBtn}>
              Get Started — it&apos;s free
            </Button>
          </Link>
          <Link href="/login" passHref legacyBehavior>
            <Button as="a" size="large" basic className={styles.secondaryBtn}>
              Log in
            </Button>
          </Link>
        </div>
      </Container>
      <div className={styles.heroBlobs}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
      </div>
    </section>

    {/* Stats */}
    <section className={styles.statsSection}>
      <Container>
        <Statistic.Group widths="four" className={styles.stats}>
          {stats.map(({ value, label }) => (
            <Statistic key={label} className={styles.stat}>
              <Statistic.Value className={styles.statValue}>
                {value}
              </Statistic.Value>
              <Statistic.Label className={styles.statLabel}>
                {label}
              </Statistic.Label>
            </Statistic>
          ))}
        </Statistic.Group>
      </Container>
    </section>

    {/* Features */}
    <section className={styles.featuresSection}>
      <Container>
        <div className={styles.sectionLabel}>
          <Icon name="bolt" size="small" />
          <span>What we offer</span>
        </div>
        <h2 className={styles.sectionTitle}>
          A community designed around&nbsp;
          <span className={styles.highlight}>real people.</span>
        </h2>
        <Grid stackable columns={2} className={styles.featureGrid}>
          {features.map(({ icon, title, desc, bg }) => (
            <Grid.Column key={title}>
              <div className={`${styles.featureCard} ${styles[`bg-${bg}`]}`}>
                <div className={styles.featureIcon}>
                  <Icon name={icon as any} size="large" />
                </div>
                <div>
                  <h3 className={styles.featureTitle}>{title}</h3>
                  <p className={styles.featureDesc}>{desc}</p>
                </div>
              </div>
            </Grid.Column>
          ))}
        </Grid>
      </Container>
    </section>

    {/* CTA banner */}
    <section className={styles.ctaSection}>
      <Container textAlign="center">
        <h2 className={styles.ctaTitle}>Ready to find your people?</h2>
        <p className={styles.ctaSub}>
          Join Mousy today. No algorithm, no ads — just genuine connections.
        </p>
        <Link href="/join" passHref legacyBehavior>
          <Button as="a" size="large" className={styles.primaryBtn}>
            Create your account
            <Icon name="arrow right" />
          </Button>
        </Link>
      </Container>
    </section>
  </div>
)

export default Landing
