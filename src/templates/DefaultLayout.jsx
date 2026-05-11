import Navbar from '../components/Navbar'

function DefaultLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default DefaultLayout
