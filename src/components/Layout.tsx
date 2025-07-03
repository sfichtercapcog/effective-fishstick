import Header from './Header'
import NavBar from './NavBar'
import Footer from './Footer'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <NavBar />
      <main className="container">{children}</main>
      <Footer />
    </>
  )
}
