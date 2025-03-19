import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import HeroSection from "./HeroSection"
import Laporatory from "./Laporatory"
import Preparatory from "./Preparatory"
import Secondary from "./Secondary"

const HomePage = () => {
  return (
    <div>
        <Navbar />
        <HeroSection />
        <Preparatory />
        <Laporatory />
        <Secondary />
        <Footer />
    </div>
  )
}

export default HomePage
