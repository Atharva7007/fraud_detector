import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Report from './pages/Report';
import CheckFraud from './pages/CheckFraud';
// import NavBar from './components/NavBar';
import SplashCursor from './assets/SplashCursor';

export default function App() {
  return (
    <div className="app-container">
      {/* <Header /> */}
      <SplashCursor/>
      {/* <NavBar/> */}
      <main className="content-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/CheckFraud' element={<CheckFraud/>}/>
          <Route path="/Report" element={<Report />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}