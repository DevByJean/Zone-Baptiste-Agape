import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Départements', href: '/departements' },
  { label: 'Activités', href: '/activites' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Galerie', href: '/galerie' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const solid = !isHome || scrolled;

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-ios ${
        solid
          ? 'bg-teal-800/85 backdrop-blur-xl backdrop-saturate-150 shadow-lg border-b border-white/10'
          : 'bg-teal-900/20 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow">
              <img
                src="./src/favicon_io/Logo28.jpeg"
                alt="logo Zone Baptiste Agapé"
                className='rounded-full w-10 h-10 bg-teal-700 hover:bg-teal-600 flex object-cover'
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-none font-display">ZONE BAPTISTE</div>
              <div className="text-teal-300 font-semibold text-xs tracking-widest">AGAPÉ — ZOBA</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const active = location.pathname === href;
              return (
                <Link
                  key={href}
                  to={href}
                  className={`px-3 py-2 rounded-full px-4 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'text-teal-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/dons"
              className="hidden sm:inline-flex items-center gap-2 bg-white text-teal-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-teal-50 transition-colors duration-150 active:scale-[0.97] transition-transform duration-150"
            >
              Faire un don
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-md text-teal-100 hover:bg-white/10 transition min-w-[44px] min-h-[44px] active:scale-95"
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-teal-900/95 backdrop-blur-xl border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  location.pathname === href
                    ? 'bg-white/20 text-white'
                    : 'text-teal-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/dons"
              className="block mt-2 text-center bg-white text-teal-700 px-4 py-2.5 rounded-lg text-sm font-bold"
            >
              Faire un don
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
