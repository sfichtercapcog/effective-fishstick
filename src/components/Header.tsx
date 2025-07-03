export default function Header() {
  return (
    <header className="top-section" style={{ backgroundImage: `url('/assets/images/central-texas-hero.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container">
        <img src="/assets/images/capcog-logo.png" alt="CAPCOG Logo" className="logo" />
        <div className="site-title">Moving Central Texas</div>
        <p className="site-subtitle">Transportation Planning by CAPCOG</p>
      </div>
    </header>
  )
}