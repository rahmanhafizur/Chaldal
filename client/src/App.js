// CHALDAL/client/src/App.js
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X as CloseIcon, MessageCircle, Menu, ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react';

// Corrected image paths to use direct URLs or accessible paths
const logo = 'https://github.com/rahmanhafizur/Chaldal/blob/main/src/assets/Logo.png?raw=true'; // Placeholder URL for Logo.png
const basket_of_organic_foods = 'https://static.vecteezy.com/system/resources/previews/047/830/714/non_2x/a-vibrant-assortment-of-fresh-vegetables-including-peppers-onions-lettuce-broccoli-tomatoes-corn-and-garlic-arranged-on-a-white-background-png.png'; // Using the provided contentFetchId URL


// Placeholder URLs for your 30 product images - REMOVED, as images are now fetched from DB
// const product1Image = 'https://www.sroddhaa.com/wp-content/uploads/2021/11/fresh-wet-apple-fruits-isolated-white-background-isolated-wet-apples-green-yellow-red-apple-fruits-isolated-white-background-135283017.jpg';
// const product2Image = 'https://m2ce.sindabad.com/pub/media/catalog/product//b/r/brand-thumb-arla-organic.jpg';
// ... (all other productXImage constants removed) ...


function App() {
  // state for managing the sign in page
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState('');
  const [userBool, setUserBool] = useState(false);

  const handleSignInClick = () => {
    setShowLoginModal(true);
  };

  const handleLogin = (username, password) => {
    // IMPORTANT: In a real application, never hardcode credentials like this.
    // Use a secure authentication system (e.g., Firebase Auth, OAuth).
    if (username === 'Fahim' && password === '1234') {
      setUser(username);
      setUserBool(true);
      setShowLoginModal(false);
    } else {
      console.log('Invalid credentials');
    }
    console.log('Logging in:', username);
    console.log('status: ', userBool);
  };



  const headerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "10px 20px",
    gap: "10px",
  };

  const signedOut = {
    display: "flex",
    gap: "10px",
  };

  const baseBtnStyle = { // KEEPING THIS AS PROVIDED BY USER
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  };

  const loginBtnStyle = {
    width: "100px",
    height: "40px",
    borderRadius: "4px", // slightly rounded rectangle
    fontWeight: "bold",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "2px solid #007bff",
  };

  const signupBtnStyle = {
    width: "100px",
    height: "40px",
    borderRadius: "4px", // slightly rounded rectangle
    fontWeight: "bold",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "2px solid #007bff",
  };

  const signedIn = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const avatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "4px", // slightly rounded rectangle
    backgroundColor: "#6c63ff",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const logoutBtnStyle = {
    width: "100px",
    height: "40px",
    borderRadius: "4px", // slightly rounded rectangle
    fontWeight: "bold",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "2px solid #007bff",
  };



  // State for managing the categories menu visibility
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // State for managing the slideshow
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  // State for managing the cart
  const [cartItems, setCartItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');

  // ---------- DATABASE INTEGRATION CHANGES START HERE ----------
  // State for products fetched from the backend
  const [products, setProducts] = useState([]); // This will now store fetched products
  const [loadingProducts, setLoadingProducts] = useState(true); // To show loading indicator
  const [productFetchError, setProductFetchError] = useState(null); // To handle fetch errors

  // Effect for fetching products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true); // Set loading to true before fetching
        // Ensure this URL matches your backend server's address and port
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data); // Set the fetched products to state
      } catch (error) {
        console.error("Could not fetch products:", error);
        setProductFetchError(error.message); // Store the error message
      } finally {
        setLoadingProducts(false); // Always set loading to false after attempt
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  // ---------- DATABASE INTEGRATION CHANGES END HERE ----------


  // Slideshow data (as provided by user)
  const slides = [
    {
      id: 1,
      imageUrl: 'https://placehold.co/1200x400/FFDDC1/E67E22?text=Big+Savings+on+Groceries!',
      title: 'Mega Grocery Sale!',
      description: 'Get up to 50% off on all fresh produce and pantry staples.',
      link: '#'
    },
    {
      id: 2,
      imageUrl: 'https://placehold.co/1200x400/C1FFD1/2ECC71?text=Exclusive+Electronics+Deals',
      title: 'Electronics Extravaganza',
      description: 'Discover amazing deals on smartphones, laptops, and more.',
      link: '#'
    },
    {
      id: 3,
      imageUrl: 'https://placehold.co/1200x400/C1D1FF/3498DB/000000?text=Home+%26+Living+Essentials',
      title: 'Home Comforts Collection',
      description: 'Transform your home with our stylish and affordable decor.',
      link: '#'
    }
  ];

  // Effect for automatic slideshow
  useEffect(() => {
    let interval;
    if (!autoplayPaused) {
      interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 5000); // Change slide every 5 seconds
    }
    return () => clearInterval(interval); // Clean up interval on component unmount or pause
  }, [autoplayPaused, slides.length]);

  // Functions for slideshow navigation
  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    setAutoplayPaused(true); // Pause autoplay on manual navigation
    setTimeout(() => setAutoplayPaused(false), 3000); // Resume after 3 seconds
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    setAutoplayPaused(true); // Pause autoplay on manual navigation
    setTimeout(() => setAutoplayPaused(false), 3000); // Resume after 3 seconds
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setAutoplayPaused(true); // Pause autoplay on manual navigation
    setTimeout(() => setAutoplayPaused(false), 3000); // Resume after 3 seconds
  };


  // Get unique categories from products (now derived from fetched products)
  // The 'category' property on the product objects from backend will be CATEGORY_ID (a number)
  // Display "Category ID: {category}" to reflect this.
  const categories = [...new Set(products.map(product => product.category))];

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Cart Functions
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Filtered products based on search term and selected category
  const filteredProducts = products.filter(product => {
    // These property names (product.name, product.description, product.category)
    // now correctly correspond to the data structure returned by your Node.js backend
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true; // Compares category ID (number)
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* show login page */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="modal-overlay" style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div className="modal-box" style={{
              background: 'white',
              padding: 20,
              borderRadius: 8,
              minWidth: 300,
              position: 'relative',
            }}>
              <button onClick={() => setShowLoginModal(false)}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'transparent',
                  border: 'none',
                  fontSize: 18,
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
              <form onSubmit={e => {
                e.preventDefault();
                const uname = e.target.username.value;
                const pwd = e.target.password.value;
                handleLogin(uname, pwd);
              }}>
                <h2>Sign In</h2>
                <div style={{ marginBottom: 12 }}>
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    style={{ width: '100%', padding: 8, marginBottom: 8 }}
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    style={{ width: '100%', padding: 8 }}
                  />
                </div>
                <button type="submit" style={{
                  width: '100%',
                  padding: 10,
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}>
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Navbar */}
        <nav className="fixed top-0 w-full bg-white shadow-md z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Left Section: Categories Button and Logo/Brand */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Customize & Control / Categories Button */}
              <div className="relative z-50"> {/* Higher z-index for dropdown */}
                <button
                  onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                  className="p-2 rounded-md hover:bg-gray-100 transition text-gray-700 flex items-center space-x-1 font-semibold whitespace-nowrap"
                  aria-label="Toggle Categories Menu"
                >
                  <Menu className="w-5 h-5" />
                  <span className="hidden sm:inline">Categories</span>
                </button>
                {showCategoriesMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                    <button
                      onClick={() => { setSelectedCategory(null); setShowCategoriesMenu(false); }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      All Products
                    </button>
                    {/* Maps category IDs from products */}
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => { setSelectedCategory(category); setShowCategoriesMenu(false); }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        {/* Display category ID for now, as backend sends IDs */}
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
                <img src={logo} alt="UrbanCart Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight select-none">
                UrbanCart
              </span>
            </div>

            {/* Search Bar - Positioned between brand and nav links */}
            <div className="flex-grow mx-4 hidden md:block max-w-xl"> {/* Added max-w-xl for better control */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>


            {/* Right Section: Nav Links & Icons */}
            <div className="flex items-center space-x-6 lg:space-x-12">
              {/* Nav Links - Shown on medium and up */}
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
              </div>

              {/* Cart Icon and Count */}
              <div className="relative cursor-pointer" onClick={() => setShowCartModal(true)}>
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md select-none">
                    {getCartItemCount()}
                  </span>
                )}
              </div>

              {/* this is for handling sign in, sign up, logout, logo of users */}
              <header style={headerStyle}>
                {userBool ? (
                  <div style={signedIn}>
                    <div style={avatarStyle}>{user[0].toUpperCase()}</div>
                    <button style={logoutBtnStyle} onClick={() => {
                      setUser("");
                      setUserBool(false);
                    }}>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div style={signedOut}>
                    <button style={loginBtnStyle} onClick={() => setShowLoginModal(true)}>
                      Sign In
                    </button>
                    <button style={signupBtnStyle}>
                      Sign Up
                    </button>
                  </div>
                )}
              </header>



              {/* Mobile Hamburger for other nav links on small screens */}
              <div className="md:hidden">
                <button className="text-gray-700 focus:outline-none">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Search Bar - shown below main nav on small screens */}
          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="pt-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 select-none leading-tight">
            Welcome to UrbanCart
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 select-none">
            Your one-stop destination for all things amazing.
          </p>

          {/* Offers Slideshow */}
          <div
            className="relative w-full overflow-hidden rounded-xl shadow-lg mt-10"
            onMouseEnter={() => setAutoplayPaused(true)}
            onMouseLeave={() => setAutoplayPaused(false)}
            style={{ aspectRatio: '3 / 1' }} // Maintain aspect ratio
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
              >
                <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4 rounded-xl">
                  <h2 className="text-3xl sm:text-5xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-lg sm:text-xl mb-4 max-w-2xl text-center">{slide.description}</p>
                  <a href={slide.link} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                    Shop Now
                  </a>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition z-20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-gray-400 bg-opacity-75'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {/* Loading/Error States for Products - ADDED THESE AS PART OF DB INTEGRATION */}
            {loadingProducts && <p className="text-gray-600 text-lg col-span-full">Loading products...</p>}
            {productFetchError && <p className="text-red-500 text-lg col-span-full">Error loading products: {productFetchError}</p>}
            
            {/* Display current category if selected */}
            {/* Only show if products are not loading and no error */}
            {!loadingProducts && !productFetchError && selectedCategory && (
              <h2 className="text-3xl font-bold text-gray-800 col-span-full text-left mb-6">{selectedCategory}</h2>
            )}

            {/* Display message if no products found */}
            {/* Only show if products are not loading, no error, and filtered list is empty */}
            {!loadingProducts && !productFetchError && filteredProducts.length === 0 && (
              <p className="text-gray-600 text-lg col-span-full">No products found matching your criteria.</p>
            )}

            {/* Dynamically render filtered product cards */}
            {/* Only render products if not loading and no error */}
            {!loadingProducts && !productFetchError && filteredProducts.map((product) => (
              <div key={product.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full max-w-xs cursor-pointer">
                <img
                  src={product.imageUrl} // This now correctly uses the imageUrl from the fetched product data
                  alt={product.name}
                  className="rounded-lg mb-4 w-full h-40 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x150/cccccc/333333?text=Image+Error'; }}
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                  <span className="text-blue-600 font-bold text-lg"> ৳{product.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* "WE PROVIDE BEST FOOD" Section - REVISED to match screenshot and fix image paths */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-gray-800 mb-4">WE PROVIDE BEST FOOD</h2>
              <p className="text-lg text-gray-600">
                It is a long established fact that a reader will be distracted by the readable
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center">
              {/* Left Column for text features */}
              <div className="md:w-1/3 lg:w-1/4 space-y-8 text-right pr-8">
                <div className="flex items-center justify-end space-x-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">Fresh</h4>
                    <p className="text-gray-600 text-sm">
                      There are many variations passages Ipsum available, a majority have.
                    </p>
                  </div>
                  <span className="text-green-500 text-4xl">🍃</span>
                </div>
                <div className="flex items-center justify-end space-x-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">Healthy</h4>
                    <p className="text-gray-600 text-sm">
                      Contrary to popular belief, lorem isn't simply random text. It roots in a
                    </p>
                  </div>
                  <span className="text-green-500 text-4xl">❤️</span>
                </div>
                <div className="flex items-center justify-end space-x-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">Eco</h4>
                    <p className="text-gray-600 text-sm">
                      It is a long established fact that a reader will be distracted by the readable
                    </p>
                  </div>
                  <span className="text-green-500 text-4xl">🌱</span>
                </div>
              </div>

              {/* Central Image */}
              <div className="md:w-1/3 flex justify-center py-8 md:py-0">
                <img
                  src={basket_of_organic_foods}
                  alt="Basket of fresh organic produce"
                  className="max-w-full h-auto max-h-96 object-contain"
                />
              </div>

              {/* Right Column for text features */}
              <div className="md:w-1/3 lg:w-1/4 space-y-8 text-left pl-8">
                <div className="flex items-center space-x-4">
                  <span className="text-green-500 text-4xl">😋</span>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">Tasty</h4>
                    <p className="text-gray-600 text-sm">
                      Many desktop publishing packages a web page editors now use
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-green-500 text-4xl">👨‍🌾</span>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">Yammy</h4>
                    <p className="text-gray-600 text-sm">
                      On various versions have evolved over the years, sometimes by accident
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-green-500 text-4xl">👑</span>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">Premium</h4>
                    <p className="text-gray-600 text-sm">
                      Ipsum is simply dummy printing and typesetting industry this is
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Delivery, Services, All-in-One, Made With Love */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <span className="text-blue-500 text-4xl mb-3">🚚</span>
                <h4 className="text-lg font-semibold text-gray-800">Fast Delivery</h4>
                <p className="text-gray-600 text-sm">Delivery within 12 hours</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-blue-500 text-4xl mb-3">📞</span>
                <h4 className="text-lg font-semibold text-gray-800">Best Services</h4>
                <p className="text-gray-600 text-sm">Support Online 24/7</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-blue-500 text-4xl mb-3">🍎</span>
                <h4 className="text-lg font-semibold text-gray-800">All-In-One</h4>
                <p className="text-gray-600 text-sm">Fruits,Veggies & Juice</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-blue-500 text-4xl mb-3">💖</span>
                <h4 className="text-lg font-semibold text-gray-800">Made With Love</h4>
                <p className="text-gray-600 text-sm">Best Services</p>
              </div>
            </div>
          </div>
        </section>


        {/* Cart Modal */}
        {showCartModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative animate-fade-in-up">
              <button
                onClick={() => setShowCartModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
                aria-label="Close cart"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Shopping Cart ({getCartItemCount()})</h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
              ) : (
                <>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center space-x-4">
                          <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                          <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-gray-600 text-sm"> ৳{item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                          >
                            -
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition"
                            aria-label={`Remove ${item.name}`}
                          >
                            <CloseIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                <div className="mt-6 flex justify-between items-center border-t pt-4">
                  <p className="text-xl font-bold text-gray-900">Total:</p>
                  <p className="text-xl font-bold text-blue-600"> ৳{getCartTotal()}</p>
                </div>
                <button className="mt-6 w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition">
                  Proceed to Checkout
                </button>
              </>
            )}
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          {/* Contact Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white uppercase">Contact</h3>
            <ul className="space-y-2">
              <li>+8801760434188 (Hafiz)</li>
              <li>+8801881802111 (Fahim)</li>
              <li>info@urbancart.com</li>
              <li className="mt-4 font-bold">Corporate Address</li>
              <li>Suhrawardy Hall, 504 no room</li>
              <li>   </li>
              <li className="mt-4 font-bold">TRADE LICENSE NO</li>
              <li>TRAD/DNCC/145647/2025</li>
            </ul>
          </div>

          {/* Other Pages Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white uppercase">Other Pages</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of use</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Refund & Return Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Sitemap</a></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white uppercase">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Manager</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Business</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Delivery</a></li>
            </ul>
          </div>

          {/* Download Our App Section */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-4 text-white uppercase">Download Our App</h3>
            <p className="text-gray-300 mb-4">
              Tackle your to-do list wherever you are with our mobile app & make your life easy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center md:justify-start">
              <a href="#" className="inline-block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-10 w-auto" />
              </a>
              <a href="#" className="inline-block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10 w-auto" />
              </a>
            </div>
            {/* Social Media Icons (using placeholders for now, can be replaced with Lucide-React or Font Awesome) */}
            <div className="flex space-x-4 justify-center md:justify-start mt-4">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.284 8.74h-2.153v-1.63c0-.528.238-.807.82-.807h1.332V3.79c-.23-.03-.99-.095-1.92-.095-2.02 0-3.375 1.233-3.375 3.498v2.097h-2.253V12h2.253v8.74h2.72V12h1.802l.27-3.26h-2.072z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
                  <path fillRule="evenodd" d="M20.447 20.452h-3.518V14.77c0-1.401-.502-2.359-1.758-2.359-1.042 0-1.66.704-1.932 1.39-.098.24-.122.57-.122.906v5.745h-3.517s.047-9.527 0-10.518h3.517v1.498c.465-.71 1.282-1.722 3.166-1.722 2.306 0 4.025 1.516 4.025 4.75V20.452zM4.015 7.288c-.023-.008-.047-.016-.07-.024-.265-.09-.544-.134-.814-.134-.78 0-1.42.34-1.91.89C.758 8.654.5 9.42.5 10.375s.258 1.72.71 2.266c.49.55 1.13.89 1.91.89.27 0 .548-.044.814-.134.023-.008.047-.016.07-.024 1.34-1.06 1.956-2.008 1.956-3.083 0-1.075-.616-2.024-1.956-3.083zM4.53 4.28c-.004-.008-.007-.016-.01-.024-.13-.238-.27-.476-.41-.704C3.898 3.238 3.295 2.5 2.41 2.5c-.886 0-1.488.738-1.706 1.056-.14.228-.28.466-.41.704-.004.008-.007.016-.01.024-1.022 1.636-1.523 3.125-1.523 4.507C-.02 11.218.482 12.607 1.5 14.243c.004.008.007.016.01.024.13.238.27.476.41.704C2.622 15.762 3.225 16.5 4.11 16.5c.886 0 1.488-.738 1.706-1.056.14-.228.28-.466.41-.704.004.008.007.016.01.024 1.022-1.636 1.523-3.125 1.523-4.507 0-1.382-.502-2.771-1.523-4.407zM5 21H1V7h4v14z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 0C8.74 0 8.332.014 7.027.072 5.722.13 4.708.318 3.79.673 2.872 1.029 2.062 1.579 1.414 2.227S.443 3.872.088 4.79C.03 6.102.016 6.51 0 7.025v9.95c.016.515.03 1.023.088 1.935.355.918.905 1.728 1.553 2.376s1.458 1.198 2.376 1.553c.912.058 1.42.072 2.732.072h9.95c1.312 0 1.72-.014 3.032-.072.918-.355 1.728-.905 2.376-1.553s1.198-1.458 1.553-2.376c.058-1.312.072-1.72.072-3.032V7.025c0-1.312-.014-1.72-.072-3.032-.355-.918-.905-1.728-1.553-2.376S19.102.443 18.184.088C16.872.03 16.464.016 15.95 0h-3.95zM12 1.83c1.298 0 1.63.004 2.628.051.854.04 1.405.21 1.75.35.49.208.79.467 1.09.764.3.298.557.6.764 1.09.14.346.31.897.35 1.75.047.998.05 1.33.05 2.628s-.004 1.63-.051 2.628c-.04.854-.21 1.405-.35 1.75-.208.49-.467.79-.764 1.09-.298.3-.6.557-1.09.764-.346.14-.897.31-1.75.35-1.72.084-2.213.084-2.628.084s-.908 0-2.628-.084c-.854-.04-1.405-.21-1.75-.35-.49-.208-.79-.467-1.09-.764-.3-.298-.557-.6-.764-1.09-.14-.346-.31-.897-.35-1.75-.047-.998-.05-1.33-.05-2.628s.004-1.63.051-2.628c.04-.854.21-1.405.35-1.75.208.49.467.79.764 1.09.298.3.6.557 1.09.764.346.14.897.31 1.75.35.998-.047 1.33-.05 2.628-.05zM12 5.565c-3.55 0-6.435 2.885-6.435 6.435S8.45 18.435 12 18.435 18.435 15.55 18.435 12 15.55 5.565 12 5.565zm0 10.575c-2.28 0-4.135-1.855-4.135-4.135S9.72 7.865 12 7.865s4.135 1.855 4.135 4.135-1.855 4.135-4.135 4.135zm5.772-9.75c-.567 0-1.025.458-1.025 1.025s.458 1.025 1.025 1.025 1.025-.458 1.025-1.025-.458-1.025-1.025-1.025z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Moved from original footer position for clearer structure) */}
        <div className="bg-gray-900 py-4 text-center text-sm flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleScrollToTop}
            className="mb-4 md:mb-0 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Scroll to top</span>
            {/* Simple arrow icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
          <p className="mb-4 md:mb-0 text-gray-400">Copyright © {new Date().getFullYear()} UrbanCart Platform Limited | All Rights Reserved</p>
          <button className="px-6 py-2 rounded-full bg-gray-600 text-white font-semibold shadow-lg cursor-not-allowed">
            We are offline now
          </button>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 flex items-center justify-center"
        aria-label="Open chat"
        title="Chat with us"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
    </>
  );
}

export default App;
