import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import useCookie from '../useCookie';

function Layout() {
  const [, setUsernameCookie] = useCookie('username');

  useEffect(() => {
    const existing = document.cookie.split(';').find(c => c.trim().startsWith('username='));
    if (!existing) {
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setUsernameCookie(`user${randomNum}`, new Date('9999-12-31'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-grow entry-content">
        <Header />
        <Navigation />
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}

export default Layout;
