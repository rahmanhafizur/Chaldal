import { ShoppingCart } from 'lucide-react';
import logo from './assets/Logo.png'

function App() {
  return (
  <>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>

    // Ensure 'font-sans' is correctly configured in your Tailwind setup (e.g., to Inter)
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Using a placeholder for the logo.
                If you have a Logo.png file, you would import it and use it like this:
                import logo from './assets/Logo.png';
                <img src={logo} alt="Chaldal Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full ..." />
            */}
            <div className="
                h-10 w-10 sm:h-12 sm:w-12
                rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold
                transition duration-300 ease-in-out
                filter drop-shadow-md
                hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]
                hover:scale-110
                cursor-pointer
                select-none
            ">
              C
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight select-none">
              Chaldal
            </span>
          </div>

          {/* Nav Links - Hidden on small screens, shown on medium and up */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-12">
            {['Home', 'Shop', 'Deals', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="
                  text-gray-700
                  hover:text-blue-600
                  font-semibold
                  transition
                  duration-200
                  select-none
                  whitespace-nowrap
                "
              >
                {item}
              </a>
            ))}

            {/* Cart */}
            <div className="relative cursor-pointer">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md select-none">
                3
              </span>
            </div>

            {/* Auth Buttons */}
            <button className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition select-none">
              Sign In
            </button>
            <button className="px-4 py-2 sm:px-6 sm:py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition select-none">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Icon (Hamburger) - Shown on small screens */}
          {/* This button currently does not have functionality to toggle a mobile menu. */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-700 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 select-none leading-tight">
          Welcome to Chaldal
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600 select-none">
          Your one-stop destination for all things amazing.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {/* Example Product Cards - Placeholder content */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-64 max-w-sm">
              <img
                src={`https://placehold.co/200x150/e0f2fe/0369a1?text=Product+${item}`}
                alt={`Product ${item}`}
                className="rounded-lg mb-4 w-full h-40 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Awesome Product {item}</h3>
              <p className="text-gray-600 mb-4">High quality and great value!</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold text-lg">$29.99</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Chaldal. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  </>
    
  );
}

export default App;
