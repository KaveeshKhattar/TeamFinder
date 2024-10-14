import './App.css'
import Header from './modules/homepage/components/Header'
import Contents from './modules/homepage/components/Contents'
import Footer from './modules/homepage/components/Footer'

function App() {

  return (
    <div className='flex flex-col justify-between items-center max-w-3xl m-auto'>
        <Header></Header>
        <Contents></Contents>
        <Footer></Footer>
    </div>
  )
}

export default App
