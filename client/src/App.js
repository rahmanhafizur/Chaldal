// CHALDAL/client/src/App.js
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X as CloseIcon, MessageCircle, Menu, ChevronLeft, ChevronRight, Search as SearchIcon, Heart, Share2, MapPin, Star, User, Package, History, MessageSquare, LogOut, PlusCircle, Settings, Edit, Trash2 } from 'lucide-react'; // Added Edit and Trash2 icons


// import SignupPage from './SignupPage'; // REMOVED: Moving SignupPage inline

const logo = 'https://github.com/rahmanhafizur/Chaldal/blob/main/client/src/assets/Logo.png?raw=true'; // Placeholder URL for Logo.png
const basket_of_organic_foods = 'https://github.com/rahmanhafizur/Chaldal/blob/main/client/src/assets/Basket_of_foods.png?raw=true'; // Using the provided contentFetchId URL

function App() {
  // State for managing the current page view ('home' or 'productDetail' or 'profile' or 'modifyProducts')
  const [currentPage, setCurrentPage] = useState('home');
  // State for storing the product data when a product is clicked
  const [selectedProduct, setSelectedProduct] = useState(null);

  // state for managing the sign in page
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [username, setUsername] = useState('');
  const [userBool, setUserBool] = useState(false);

  const [adminBool, setAdminBool] = useState(false);
  // New state for user role: 'guest', 'customer', 'admin'

  const [userRole, setUserRole] = useState('guest'); // Default to guest

  // New state for storing full user profile details
  const [userProfileData, setUserProfileData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
  });


  // State for managing the cart
  const [cartItems, setCartItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  // New state for payment confirmation modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // State for products fetched from the backend (moved up for broader access)
  const [products, setProducts] = useState([]); // This will now store fetched products
  const [loadingProducts, setLoadingProducts] = useState(true); // To show loading indicator
  const [productFetchError, setProductFetchError] = useState(null); // To handle fetch errors

  // Profile Menu State - MOVED INSIDE App FUNCTION
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // New state for storing unique category objects (id and name)
  const [allCategories, setAllCategories] = useState([]);


  // Added by Fahim
  // Merging the cart items after signIn
  // This function now explicitly takes the customerId and the current local cart items
  const mergeCartItems = async (currentCustomerId) => {
    if (currentCustomerId) { // Ensure we have a customerId to proceed
      console.log('check1: Merging cart items for user:', currentCustomerId);
      try {
        // 1. Fetch the user's existing cart from the backend
        const response = await fetch('http://localhost:5000/api/getCartItems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: currentCustomerId, // Use the passed customerId
          }),
        });

        const backendCartData = await response.json();

        if (response.ok) {
          console.log('Got backend cart items successfully:', backendCartData.message);

          setCartItems(backendCartData);

        } else {
          console.error('Failed to fetch cart items from backend:', backendCartData.message || 'Unknown error');
          // Using a custom alert/modal instead of window.alert
          // alert('Failed to fetch cart items: ' + (backendCartData.message || 'Please try again.'));
        }
      } catch (error) {
        console.error('Network error fetching/merging cart items:', error);
        // Using a custom alert/modal instead of window.alert
        // alert('Network error fetching/merging cart items. Please try again.');
      }
    } else {
      console.log('User not logged in. Cannot merge cart items.');
    }
  }



  // Added by Fahim ... ...
  // MODIFIED: handleLogin function to make an API call to the backend
  const handleLogin = async (username, password) => { // Make this function async
    try {
      // Data to be sent to the backend
      const loginData = {
        username: username, // This will be matched against CUSTOMER_EMAIL or CUSTOMER_NAME
        password: password,
      };

      // Make the POST request to your backend's sign-in endpoint
      // Ensure this URL matches your backend server's address and port
      const response = await fetch('http://localhost:5000/api/auth/signIn', {
        method: 'POST', // HTTP method is POST
        headers: {
          'Content-Type': 'application/json', // Inform the server that the body is JSON
        },
        body: JSON.stringify(loginData), // Convert JS object to JSON string
      });

      const data = await response.json(); // Parse the JSON response from the server

      if (response.ok) { // Check if the HTTP status is 2xx (success)
        console.log('Sign-in successful:', data.message);
        // Update client-side state with user info received from the backend
        setCustomerId(data.user.id);
        setUsername(data.user.username); // Using data.user.name as the display name
        setUserBool(true); // Set user as logged in
        setShowLoginModal(false); // Close the login modal
        setUserRole(data.user.status || 'customer'); // Set user role based on backend response

        mergeCartItems(data.user.id)


        console.log('The user is a/an ' + data.user.status);

        // this will check a user if he/she is an admin or not
        if(data.user.status == 'admin') {
          setAdminBool(true);
        }

        // Update user profile data from login response if available
        setUserProfileData({
          customerName: data.user.customerName || '',
          customerPhone: data.user.customerPhone || '',
          customerEmail: data.user.customerEmail || '',
        });

        mergeCartItems(data.user.id)

        // IMPORTANT: In a real application, if your backend sends a JWT,
        // you would store it here (e.g., in localStorage) for future authenticated requests.
        // Example: localStorage.setItem('authToken', data.token);

        // alert('Sign-in successful! Welcome, ' + data.user.name); // Provide user feedback
      } else {
        // Handle server-side errors (e.g., 401 Invalid credentials, 400 missing fields)
        console.error('Sign-in failed:', data.message || 'Unknown error');
        // Using a custom alert/modal instead of window.alert
        // alert('Sign-in failed: ' + (data.message || 'Please check your credentials.'));
      }
    } catch (error) {
      // Handle network errors or issues with the fetch operation itself
      console.error('Network error during sign-in:', error);
      // Using a custom alert/modal instead of window.alert
      // alert('An error occurred during sign-in. Please try again later.');
    }
    console.log('Logging in:', username);
    console.log('status: ', userBool);
  };


  // Added by Fahim ... ...
  // NEW FUNCTION: Handles click on "Sign In" from the signup modal
  const handleSignInFromSignup = () => {
    setShowSignupModal(false); // Close the signup modal
    setShowLoginModal(true);    // Open the login modal
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

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');

  // ---------- DATABASE INTEGRATION CHANGES START HERE ----------
  // Effect for fetching products from backend
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true); // Set loading to true before fetching
      // Ensure this URL matches your backend server's address and port
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        // If the response is not OK, it means there was a server error or network issue
        throw new Error(`HTTP error! status: ${response.status}. Please ensure your backend server is running and accessible at http://localhost:5000.`);
      }
      const data = await response.json();
      setProducts(data); // Set the fetched products to state

      // Extract unique categories from fetched products
      const uniqueCategories = new Map();
      data.forEach(product => {
        // Assuming product.category is an object like { id: 1, name: 'Fruits' }
        // Or if it's a simple ID, handle it
        if (product.category) {
          if (typeof product.category === 'object' && product.category.id && product.category.name) {
            uniqueCategories.set(product.category.id, {
              id: product.category.id,
              name: product.category.name
            });
          } else if (typeof product.category === 'number' || typeof product.category === 'string') {
            // If category is just an ID or name, create a simple object for consistency
            uniqueCategories.set(product.category, {
              id: product.category,
              name: `Category ID: ${product.category}` // Fallback name
            });
          }
        }
      });
      setAllCategories(Array.from(uniqueCategories.values()));

    } catch (error) {
      console.error("Could not fetch products:", error);
      // Provide a more user-friendly error message for common network issues
      if (error.message.includes("Failed to fetch")) {
        setProductFetchError("Failed to connect to the backend server. Please ensure your Node.js server is running on http://localhost:5000 and that CORS is configured correctly.");
      } else {
        setProductFetchError(error.message); // Store the error message
      }
    } finally {
      setLoadingProducts(false); // Always set loading to false after attempt
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  // ---------- DATABASE INTEGRATION CHANGES END HERE ----------

  // Slideshow data (as provided by user) - REMOVED title and description
  const slides = [
    {
      id: 1,
      imageUrl: 'https://d2t8nl1y0ie1km.cloudfront.net/images/thumbs/679b43cde3368b3c908beff4_Uniliver-banner_Web_1552.webp',
      link: '#'
    },
    {
      id: 2,
      imageUrl: 'https://d2t8nl1y0ie1km.cloudfront.net/images/thumbs/679b4b026f42bdb0a6494a20_Spice_Web_1552.webp',
      link: '#'
    },
    {
      id: 3,
      imageUrl: 'https://d2t8nl1y0ie1km.cloudfront.net/images/thumbs/681b31444627ed704a817a7b_668681ca0b15b6fc211b0d4f_aci%20banner%20DESKTOP_1552.jpeg',
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

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Function to handle scrolling to a specific section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cart Functions
  const addToCart = async (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    let newProductQuantity;

    if (existingItem) {
      newProductQuantity = existingItem.quantity + 1;
    } else {
      newProductQuantity = 1;
    }

    // Optimistically update local state
    setCartItems((prevItems) => {
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    if (userBool && customerId) {
      try {
        console.log(`User ${customerId} adding product ${product.id}. New quantity: ${newProductQuantity}`);
        const response = await fetch('http://localhost:5000/api/cartUpdate/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: customerId,
            productId: product.id,
            quantity: newProductQuantity,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to update backend cart:', errorData.message || 'Unknown error');
          // Revert local state if backend update fails
          setCartItems(prevItems => prevItems.map(item =>
            item.id === product.id ? { ...item, quantity: existingItem ? existingItem.quantity : 0 } : item
          ).filter(item => item.quantity > 0));
        }
      } catch (error) {
        console.error('Network error updating cart in backend:', error);
        // Revert local state if network error
        setCartItems(prevItems => prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: existingItem ? existingItem.quantity : 0 } : item
        ).filter(item => item.quantity > 0));
      }
    } else {
      console.log('User not logged in. Cart updated locally only.');
    }
  };


  const removeFromCart = async (product) => {
    // Optimistically update local state
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== product.id));

    if (userBool && customerId) {
      try {
        console.log(`User ${customerId} removing product ${product.id}. Setting quantity to 0.`);
        const response = await fetch('http://localhost:5000/api/cartUpdate/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: customerId,
            productId: product.id,
            quantity: 0, // Set quantity to 0 to remove from backend cart
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to remove item from backend cart:', errorData.message || 'Unknown error');
          // Revert local state if backend update fails (add the item back)
          setCartItems(prevItems => [...prevItems, product]);
        }
      } catch (error) {
        console.error('Network error removing item from cart in backend:', error);
        // Revert local state if network error (add the item back)
        setCartItems(prevItems => [...prevItems, product]);
      }
    } else {
      console.log('User not logged in. Cart updated locally only.');
    }
  };

  const updateCartQuantity = async (productId, newProductQuantity) => {
    const existingItem = cartItems.find((item) => item.id === productId);
    const quantityToUpdate = Math.max(0, newProductQuantity); // Ensure quantity is not negative

    // Optimistically update local state
    setCartItems((prevItems) => {
      if (quantityToUpdate === 0) {
        return prevItems.filter((item) => item.id !== productId);
      } else {
        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: quantityToUpdate } : item
        );
      }
    });

    if (userBool && customerId) {
      try {
        console.log(`User ${customerId} updating product ${productId}. New quantity: ${quantityToUpdate}`);
        const response = await fetch('http://localhost:5000/api/cartUpdate/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: customerId,
            productId: productId,
            quantity: quantityToUpdate,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to update backend cart quantity:', errorData.message || 'Unknown error');
          // Revert local state if backend update fails
          setCartItems(prevItems => prevItems.map(item =>
            item.id === productId ? { ...item, quantity: existingItem ? existingItem.quantity : 0 } : item
          ).filter(item => item.quantity > 0));
        }
      } catch (error) {
        console.error('Network error updating cart quantity in backend:', error);
        // Revert local state if network error
        setCartItems(prevItems => prevItems.map(item =>
          item.id === productId ? { ...item, quantity: existingItem ? existingItem.quantity : 0 } : item
        ).filter(item => item.quantity > 0));
      }
    } else {
      console.log('User not logged in. Cart updated locally only.');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Function to handle product click
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('productDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top when navigating to product detail
  };

  // Filtered products based on search term and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    // Correctly access category ID for filtering
    const matchesCategory = selectedCategory ? (product.category && product.category.id === selectedCategory) : true;
    return matchesSearch && matchesCategory;
  });

  // Product Detail Page Component
  const ProductDetailPage = ({ product, onBackClick, onAddToCart }) => {
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    // State to store submitted reviews for this product
    const [productReviews, setProductReviews] = useState([]);

    const handleRatingClick = (rating) => {
      setUserRating(rating);
    };

    //*handleSubmitReview* by hafiz
    const handleSubmitReview = async () => {
      if (userReview.trim() === '' || userRating === 0) {
        // Using a custom modal for alerts instead of window.alert
        console.warn('Please provide a rating and a review.');
        // In a real app, you'd show a modal here
        return;
      }

      console.log('Submitting Review:', { product: product.name, rating: userRating, review: userReview });

      // Simulate API call to backend
      try {
        const response = await fetch('http://localhost:5000/api/submitReview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.id,
            customerId: customerId, // Assuming customerId is available
            username: username, // Assuming username is available
            rating: userRating,
            review: userReview,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Review submitted successfully:', data.message);
          // Add the new review to the local state for immediate display
          setProductReviews(prevReviews => [...prevReviews, {
            id: Date.now(), // Unique ID for key
            username: username,
            rating: userRating,
            review: userReview,
            date: new Date().toLocaleDateString(), // Current date
          }]);
          setUserRating(0);
          setUserReview('');
          // Show a success message to the user (e.g., via a temporary notification or modal)
          // alert('Review submitted successfully!'); // Use custom modal
        } else {
          console.error('Failed to submit review:', data.message || 'Unknown error');
          // alert('Failed to submit review: ' + (data.message || 'Please try again.')); // Use custom modal
        }
      } catch (error) {
        console.error('Network error submitting review:', error);
        // alert('Network error submitting review. Please try again.'); // Use custom modal
      }
    };

    if (!product) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <p className="text-xl text-gray-700">Product not found.</p>
          <button
            onClick={onBackClick}
            className="mt-4 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      );
    }

    return (
      <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-gray-800">
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 mb-6"> {/* Smaller font */}
          <button onClick={onBackClick} className="hover:underline">Home</button> &gt; <span className="font-semibold">{product.name}</span>
        </nav>

        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row gap-8">
          {/* Product Image Section */}
          <div className="md:w-1/2 flex flex-col items-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full max-w-md h-auto object-contain rounded-lg shadow-md"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/cccccc/333333?text=Image+Error'; }}
            />
            {/* Thumbnail/Small Image (as per screenshot) */}
            <div className="mt-4 w-20 h-20 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center"> {/* Smaller thumbnail */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/cccccc/333333?text=Thumb'; }}
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="md:w-1/2 flex flex-col">
            <h1 className="text-2xl font-extrabold text-blue-700 mb-1">{product.name}</h1> {/* Even smaller font */}
            <p className="text-sm text-gray-600 mb-3">{product.description}</p> {/* Even smaller font */}

            <div className="flex items-center mb-3"> {/* Smaller margin */}
              <span className="text-xl font-bold text-red-600">৳{product.price.toFixed(2)}</span> {/* Even smaller font */}
              <span className="text-xs text-gray-500 ml-1">/ Per Unit</span> {/* Even smaller font */}
            </div>

            <div className="flex items-center gap-3 mb-5"> {/* Smaller gap and margin */}
              <button
                onClick={() => onAddToCart(product)}
                className="px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-1" // Smaller button, text
              >
                <span>+ Add to Bag</span>
              </button>
              <button className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"> {/* Smaller padding */}
                <Heart className="w-4 h-4" /> {/* Smaller icon */}
              </button>
              <button className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"> {/* Smaller padding */}
                <Share2 className="w-4 h-4" /> {/* Smaller icon */}
              </button>
            </div>

            <div className="mb-5"> {/* Smaller margin */}
              <h3 className="font-semibold text-sm text-gray-700 mb-1">Product Tags :</h3> {/* Smaller font */}
              {/* Assuming tags might be an array of strings on the product object */}
              <div className="flex flex-wrap gap-1"> {/* Smaller gap */}
                {product.tags && product.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"> {/* Adjusted font, padding */}
                    {tag}
                  </span>
                ))}
                {/* Placeholder tags if product.tags is not available */}
                {!product.tags && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"> {/* Adjusted font, padding */}
                    Fresh-vegetables
                  </span>
                )}
              </div>
            </div>

            {/* SKU and In-stock status */}
            <div className="bg-gray-100 p-3 rounded-lg mb-5"> {/* Smaller padding, margin */}
              <div className="flex justify-between items-center mb-1"> {/* Smaller margin */}
                <span className="font-semibold text-xs text-gray-700">SKU: {product.sku || 'N/A'}</span> {/* Smaller font */}
                <span className="text-green-600 font-semibold flex items-center text-xs"> {/* Smaller font */}
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"> {/* Smaller icon */}
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  In-stock
                </span>
              </div>
              <p className="text-xs text-gray-600">A seasonal delight for your culinary creations.</p> {/* Smaller font */}
            </div>

            {/* Delivery and Location */}
            <div className="mb-5"> {/* Smaller margin */}
              <div className="flex items-center text-xs text-gray-700 mb-1"> {/* Smaller font */}
                <span className="mr-1 text-blue-500"><MapPin className="w-4 h-4" /></span> {/* Smaller icon */}
                <span>Delivery: 1-2 hours</span>
              </div>
              <div className="flex items-center text-xs text-gray-700"> {/* Smaller font */}
                <span className="mr-1 text-blue-500"><MapPin className="w-4 h-4" /></span> {/* Smaller icon */}
                <span>Location: <a href="#" className="text-blue-600 hover:underline">Select your delivery location</a></span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="mb-6">
              <h3 className="font-semibold text-base text-gray-700 mb-2">Card Payment</h3> {/* Smaller font */}
              <div className="flex items-center space-x-4">
                {/* Placeholder for payment icons */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 w-auto" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png" alt="MasterCard" className="h-6 w-auto" />
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIzaEijMRVmEe2vvyBj7HR95LYnR3Vv747CKMQoqt_r8Dpe65Fgvgcux3TX7Ffvv6GjqU&usqp=CAU" alt="Nagad" className="h-6 w-auto" />
              </div>
            </div>

            {/* Mobile Payment and COD */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <img src="https://downloadr2.apkmirror.com/wp-content/uploads/2022/08/84/62f92578037f0.png" alt="bKash" className="h-8 w-auto" />
              </div>
              <div className="flex items-center space-x-2">
                <img src="https://play-lh.googleusercontent.com/EQC9NtbtRvsNcU1r_5Dr8pWm3hPfN3OjGjzkOqzCEPDJvqBGKyfU9-a2ajNtcrIg1rs" alt="Nagad" className="h-8 w-auto" />
              </div>
              <div className="flex items-center space-x-2">
                <img src="https://play-lh.googleusercontent.com/sDY6YSDobbm_rX-aozinIX5tVYBSea1nAyXYI4TJlije2_AF5_5aG3iAS7nlrgo0lk8" alt="bKash" className="h-8 w-auto" />
              </div>
              <div className="flex items-center space-x-2">
                <img src="https://5.imimg.com/data5/LZ/BV/ZZ/SELLER-78615388/trustpage-rtb-5-jpg-500x500.jpg" alt="bKash" className="h-8 w-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow-lg"> {/* Smaller padding, margin */}
          <h2 className="text-lg font-bold text-gray-800 mb-3">Customer Reviews</h2> {/* Smaller font, updated title */}

          {/* Star Rating Input */}
          <div className="mb-3 flex items-center"> {/* Smaller margin */}
            <span className="font-semibold text-sm text-gray-700 mr-2">Rate this product:</span> {/* Smaller font */}
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 cursor-pointer transition-colors ${ // Smaller stars
                  star <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                onClick={() => handleRatingClick(star)}
              />
            ))}
          </div>

          {/* Review Textarea */}
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm" // Smaller padding, margin
            rows="3" // Fewer rows
            placeholder="Write your review here..."
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
          ></textarea>

          {/* Submit Review Button */}
          <button
            onClick={handleSubmitReview}
            className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300" // Smaller button, text
          >
            Submit Review
          </button>

          {/* Display submitted reviews */}
          <div className="mt-6 space-y-4">
            {productReviews.length === 0 ? (
              <p className="mt-4 text-xs text-gray-600 text-center">No reviews yet. Be the first one to review !</p>
            ) : (
              productReviews.map((review, index) => (
                <div key={review.id} className="border-t border-gray-200 pt-4">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-sm text-gray-800 mr-2">{review.username}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-700">{review.review}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };


  return (
    <>
      {/* show signup page */}
      {showSignupModal && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
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
                maxHeight: '90vh', // Limit height to 90% of viewport height
                overflowY: 'auto', // Enable vertical scrolling
              }}>
                <button onClick={() => setShowSignupModal(false)}
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
                {/* Render the SignupPage component here */}
                <SignupPage
                  onClose={() => setShowSignupModal(false)}
                  onSignInClick={handleSignInFromSignup}
                />
              </div>
            </div>
          </div>
        </>
      )}



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
                    {allCategories.map((cat) => (
                      <button
                        key={cat.id} // Use cat.id for the key
                        onClick={() => { setSelectedCategory(cat.id); setShowCategoriesMenu(false); }} // Set selectedCategory to the ID
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        {cat.name} {/* Render cat.name */}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Logo and UrbanCart text - now clickable to go home */}
              <button
                onClick={() => { setCurrentPage('home'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center space-x-2 sm:space-x-2 cursor-pointer group"
                aria-label="Go to Home"
              >
                <div className="
                  h-10 w-10 sm:h-12 sm:w-12
                  rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold
                  transition duration-300 ease-in-out
                  filter drop-shadow-md
                  group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]
                  group-hover:scale-110
                  select-none
                ">
                  <img src={logo} alt="UrbanCart Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight select-none group-hover:text-blue-600 transition duration-200">
                  UrbanCart
                </span>
              </button>
            </div>

            {/* Search Bar - Positioned between brand and nav links */}
            <div className="flex-1 mx-4 hidden md:block">
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
                {/* Home link also navigates to home page */}
                <button
                  onClick={() => { setCurrentPage('home'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-700 hover:text-blue-600 font-semibold transition duration-200 select-none whitespace-nowrap"
                >
                  Home
                </button>
                {/* Shop and Deals now navigate to home for consistency */}
                <button
                  onClick={() => { setCurrentPage('home'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-700 hover:text-blue-600 font-semibold transition duration-200 select-none whitespace-nowrap"
                >
                  Shop
                </button>
                <button
                  onClick={() => { setCurrentPage('home'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gray-700 hover:text-blue-600 font-semibold transition duration-200 select-none whitespace-nowrap"
                >
                  Deals
                </button>
                {/* About link scrolls to "WE PROVIDE BEST FOOD" section */}
                <button
                  onClick={() => scrollToSection('about-section')}
                  className="text-gray-700 hover:text-blue-600 font-semibold transition duration-200 select-none whitespace-nowrap"
                >
                  About
                </button>
                {/* Contact link scrolls to Footer */}
                <button
                  onClick={() => scrollToSection('footer-section')}
                  className="text-gray-700 hover:text-blue-600 font-semibold transition duration-200 select-none whitespace-nowrap"
                >
                  Contact
                </button>
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
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                      aria-label="User Profile"
                    >
                      <User className="w-6 h-6" />
                      <span className="hidden md:inline">{username}</span>
                    </button>
                    {showProfileMenu && (
                      userRole === 'admin' ? (
                        <AdminProfileModal
                          onClose={() => setShowProfileMenu(false)}
                          onLogout={() => {
                            setCustomerId("");
                            setUsername("");
                            setUserBool(false);
                            setCartItems([]);
                            setUserRole('guest'); // Reset role on logout
                            setShowProfileMenu(false);
                          }}
                          onViewProfile={() => { // Pass onViewProfile to AdminProfileModal
                            setShowProfileMenu(false);
                            setCurrentPage('profile');
                          }}
                          onViewModifyProducts={() => { // New prop for Modify Products
                            setShowProfileMenu(false);
                            setCurrentPage('modifyProducts');
                          }}
                        />
                      ) : (
                        <UserProfileModal
                          onClose={() => setShowProfileMenu(false)}
                          onLogout={() => {
                            setCustomerId("");
                            setUsername("");
                            setUserBool(false);
                            setCartItems([]);
                            setUserRole('guest'); // Reset role on logout
                            setShowProfileMenu(false);
                          }}
                          onViewProfile={() => {
                            setShowProfileMenu(false);
                            setCurrentPage('profile');
                          }}
                          // Pass userProfileData and setUserProfileData to UserProfileModal
                          userProfileData={userProfileData}
                          setUserProfileData={setUserProfileData}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div style={signedOut}>
                    <button style={loginBtnStyle} onClick={() => setShowLoginModal(true)}>
                      Sign In
                    </button>
                    <button style={signupBtnStyle} onClick={() => setShowSignupModal(true)}>
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

        {/* Main Content Area - Conditional Rendering */}
        {currentPage === 'home' ? (
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
                  <img src={slide.imageUrl} alt={`Slide ${slide.id}`} className="w-full h-full object-cover rounded-xl" /> {/* Alt text changed */}
                  {/* Removed dynamic text overlay */}
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
                <h2 className="text-3xl font-bold text-gray-800 col-span-full text-left mb-6">
                  {allCategories.find(cat => cat.id === selectedCategory)?.name || `Category ID: ${selectedCategory}`}
                </h2>
              )}

              {/* Display message if no products found */}
              {/* Only show if products are not loading, no error, and filtered list is empty */}
              {!loadingProducts && !productFetchError && filteredProducts.length === 0 && (
                <p className="text-gray-600 text-lg col-span-full">No products found matching your criteria.</p>
              )}

              {/* Dynamically render filtered product cards */}
              {/* Only render products if not loading and no error */}
              {!loadingProducts && !productFetchError && filteredProducts.map((product) => (
                <div key={product.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full max-w-xs cursor-pointer"
                  onClick={() => handleProductClick(product)} // Add onClick handler here
                >
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
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }} // Prevent product click when adding to cart
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        ) : currentPage === 'productDetail' ? (
          <ProductDetailPage
            product={selectedProduct}
            onBackClick={() => setCurrentPage('home')}
            onAddToCart={addToCart}
          />
        ) : currentPage === 'profile' && userBool ? (
          <UserProfilePage
            customerId={customerId}
            username={username}
            userProfileData={userProfileData}
            setUserProfileData={setUserProfileData}
            onBackClick={() => setCurrentPage('home')}
          />
        ) : currentPage === 'modifyProducts' && adminBool ? (
          <ModifyProductsPage
            products={products}
            fetchProducts={fetchProducts} // Pass fetchProducts to allow refresh
            onBackClick={() => setCurrentPage('home')}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-28">
            <p className="text-xl text-gray-700">Please sign in as an admin to access this page.</p>
            <button
              onClick={() => setCurrentPage('home')}
              className="mt-4 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* "WE PROVIDE BEST FOOD" Section - REVISED to match screenshot and fix image paths */}
        <section id="about-section" className="py-16 bg-white"> {/* Added id for scrolling */}
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
                            onClick={() => removeFromCart(item)}
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
                  <button
                    onClick={() => { setShowCartModal(false); setShowPaymentModal(true); }}
                    className="mt-6 w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        )}


        {/* Footer */}
        <footer id="footer-section" className="bg-gray-800 text-white mt-0"> {/* Added id for scrolling */}
          {/* <footer className="bg-gray-800 text-white mt-16"> */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            {/* Contact Section */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white uppercase">Contact</h3>
              <ul className="space-y-2">
                <li>+8801760434188 (Hafiz)</li>
                <li>+8801881802111 (Fahim)</li>
                <li>info@urbancart.com</li>
                <li className="mt-4 font-bold">Corporate Address</li>
                <li>Suhrawardy Hall, 507 no room</li>
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
                    <path fillRule="evenodd" d="M12 0C8.74 0 8.332.014 7.027.072 5.722.13 4.708.318 3.79.673 2.872 1.029 2.062 1.579 1.414 2.227S.443 3.872.088 4.79C.03 6.102.016 6.51 0 7.025v9.95c.016.515.03 1.023.088 1.935.355.918.905 1.728 1.553 2.376s1.458 1.198 2.376 1.553c.912.058 1.42.072 2.732.072h9.95c1.312 0 1.72-.014 3.032-.072.918-.355 1.728-.905 2.376-1.553s1.198-1.458 1.553-2.376c.058-1.312.072-1.72.072-3.032V7.025c0-1.312-.014-1.72-.072-3.032-.355-.918-.905-1.728-1.553-2.376S19.102.443 18.184.088C16.872.03 16.464.016 15.95 0h-3.95zM12 1.83c1.298 0 1.63.004 2.628.051.854.04 1.405.21 1.75.35.49.208.79.467 1.09.764.3.298.557.6.764 1.09.14.346.31.897.35 1.75.047.998.05 1.33.05 2.628s-.004 1.63-.051 2.628c-.04.854-.21 1.405-.35 1.75-.208.49-.467.79-.764 1.09-.298.3-.6.557-1.09.764-.14-.346-.31-.897-.35-1.75-.047-.998-.05-1.33-.05-2.628s.004-1.63.051-2.628c.04-.854.21-1.405.35-1.75.208.49.467.79.764 1.09.298.3.6.557 1.09.764.346.14.897.31 1.75.35.998-.047 1.33-.05 2.628-.05zM12 5.565c-3.55 0-6.435 2.885-6.435 6.435S8.45 18.435 12 18.435 18.435 15.55 18.435 12 15.55 5.565 12 5.565zm0 10.575c-2.28 0-4.135-1.855-4.135-4.135S9.72 7.865 12 7.865s4.135 1.855 4.135 4.135-1.855 4.135-4.135 4.135zm5.772-9.75c-.567 0-1.025.458-1.025 1.025s.458 1.025 1.025 1.025 1.025-.458 1.025-1.025-.458-1.025-1.025-1.025z" clipRule="evenodd" />
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

      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <PaymentConfirmationModal
          cartItems={cartItems}
          deliveryCharge={50} // Fixed delivery charge
          onClose={() => setShowPaymentModal(false)}
          onConfirmPayment={async (selectedPaymentMethod) => {
            console.log('Payment confirmed with method:', selectedPaymentMethod);

            // Generate a simple order ID (in a real app, this would be from the backend)
            const orderId = `ORD-${Date.now()}`;
            const orderDate = new Date().toISOString();
            const totalAmount = (cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + 50).toFixed(2);

            if (!customerId) {
              console.error("No customer ID available. Cannot place order.");
              // You might want to show an alert or redirect to login
              return;
            }

            try {
              // 1. Place the order in the database
              const orderResponse = await fetch('http://localhost:5000/api/placeOrder', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId,
                  customerId,
                  orderDate,
                  totalAmount,
                  paymentId: 1, // Placeholder payment ID, adjust as needed
                  deliveryMode: selectedPaymentMethod,
                  deliveryStatus: 'Pending',
                  orderItems: cartItems, // Send all cart items as part of the order
                }),
              });

              const orderData = await orderResponse.json();

              if (orderResponse.ok) {
                console.log('Order placed successfully:', orderData.message);

                // 2. Update cart items in the database (clear the user's cart)
                const clearCartResponse = await fetch('http://localhost:5000/api/clearCart', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ customerId }),
                });

                const clearCartData = await clearCartResponse.json();

                if (clearCartResponse.ok) {
                  console.log('Cart cleared successfully:', clearCartData.message);
                  setCartItems([]); // Clear local cart state
                  setShowPaymentModal(false); // Close payment modal
                  alert(`Order placed successfully! Your Order ID is: ${orderId}`); // Use custom modal in production
                } else {
                  console.error('Failed to clear cart:', clearCartData.message || 'Unknown error');
                  alert('Order placed, but failed to clear cart. Please refresh.'); // Use custom modal
                }

              } else {
                console.error('Failed to place order:', orderData.message || 'Unknown error');
                alert('Failed to place order: ' + (orderData.message || 'Please try again.')); // Use custom modal
              }
            } catch (error) {
              console.error('Network error placing order or clearing cart:', error);
              alert('Network error. Please try again later.'); // Use custom modal
            }
          }}
        />
      )}
    </>
  );
}

export default App;


//*UserProfileModal* by hafiz
const UserProfileModal = ({ onClose, onLogout, onViewProfile, userProfileData, setUserProfileData }) => {
  const handleOptionClick = (option) => {
    console.log(`User clicked: ${option}`);
    if (option === 'Your Profile') {
      onViewProfile();
    }
    onClose(); // Close modal after clicking an option
  };

  return (
    <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
      <h3 className="px-4 py-2 text-sm font-bold text-gray-800 border-b border-gray-200">Your Profile</h3>
      <button
        onClick={() => handleOptionClick('Your Profile')}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <User className="w-4 h-4" />
        <span>Your Profile</span>
      </button>
      <button
        onClick={() => handleOptionClick('Track Your Order')}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <Package className="w-4 h-4" />
        <span>Track Your Order</span>
      </button>
      <button
        onClick={() => handleOptionClick('Your Past Orders')}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <History className="w-4 h-4" />
        <span>Your Past Orders</span>
      </button>
      <button
        onClick={() => handleOptionClick('Your Ratings and Reviews')}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Your Ratings and Reviews</span>
      </button>
      <button
        onClick={onLogout}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left border-t border-gray-200 mt-1"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>
    </div>
  );
};

//*AdminProfileModal* by hafiz
const AdminProfileModal = ({ onClose, onLogout, onViewProfile, onViewModifyProducts }) => { // Added onViewModifyProducts prop
  const handleOptionClick = (option) => {
    console.log(`Admin clicked: ${option}`);
    if (option === 'Your Profile') { // Check for the specific option
      onViewProfile(); // Call onViewProfile when "Your Profile" is clicked
    } else if (option === 'Modify Products') {
      onViewModifyProducts();
    }
    onClose(); // Close modal after clicking an option
  };

  return (
    <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
      <h3 className="px-4 py-2 text-sm font-bold text-gray-800 border-b border-gray-200">Admin Panel</h3>
      <button
        onClick={() => handleOptionClick('Your Profile')}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <User className="w-4 h-4" />
        <span>Your Profile</span>
      </button>
      <button
        onClick={() => handleOptionClick('Update Order Status')}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <Settings className="w-4 h-4" />
        <span>Update Order Status</span>
      </button>
      <button
        onClick={() => handleOptionClick('Modify Products')}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <PlusCircle className="w-4 h-4" /> {/* Keeping PlusCircle for now, can change if needed */}
        <span>Modify Products</span>
      </button>
      <button
        onClick={onLogout}
        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left border-t border-gray-200 mt-1"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>
    </div>
  );
};

//*PaymentConfirmationModal* by hafiz
const PaymentConfirmationModal = ({ cartItems, deliveryCharge, onClose, onConfirmPayment }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash_on_delivery'); // Default to COD

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalPayable = subtotal + deliveryCharge;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
          aria-label="Close payment confirmation"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Order Summary</h2>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                <p className="text-gray-600 text-xs">Quantity: {item.quantity} x ৳{item.price.toFixed(2)}</p>
              </div>
              <p className="font-bold text-gray-900 text-sm">৳{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Delivery Charge:</span>
            <span>৳{deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-blue-600 pt-2 border-t border-gray-200">
            <span>Total Payable:</span>
            <span>৳{totalPayable.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Options Selection */}
        <div className="mt-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Method</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={selectedPaymentMethod === 'cash_on_delivery'}
                onChange={() => setSelectedPaymentMethod('cash_on_delivery')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700">Cash on Delivery</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card_payment"
                checked={selectedPaymentMethod === 'card_payment'}
                onChange={() => setSelectedPaymentMethod('card_payment')}
                className="form-radio h-4 w-4 text-blue-600"
                disabled // Disable for now
              />
              <span className="text-gray-700">Card Payment (Coming Soon)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="mobile_banking"
                checked={selectedPaymentMethod === 'mobile_banking'}
                onChange={() => setSelectedPaymentMethod('mobile_banking')}
                className="form-radio h-4 w-4 text-blue-600"
                disabled // Disable for now
              />
              <span className="text-gray-700">Mobile Banking (Coming Soon)</span>
            </label>
          </div>
        </div>

        <button
          onClick={() => onConfirmPayment(selectedPaymentMethod)}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

//*SignupPage* by hafiz
const SignupPage = ({ onClose, onSignInClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data.message);
        // Optionally, automatically log in the user or redirect to login
        onSignInClick(); // Go to sign-in page after successful signup
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Network error during signup:', err);
      setError('An error occurred during signup. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="w-full max-w-sm">
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <button onClick={onSignInClick} className="text-blue-600 hover:underline">
          Sign In
        </button>
      </p>
    </div>
  );
};

// New UserProfilePage Component
const UserProfilePage = ({ customerId, username, userProfileData, setUserProfileData, onBackClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    customerName: userProfileData.customerName,
    customerPhone: userProfileData.customerPhone,
    customerEmail: userProfileData.customerEmail,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' }); // 'success' or 'error'

  // Effect to update editForm when userProfileData changes (e.g., after login or successful update)
  useEffect(() => {
    setEditForm(prevForm => ({
      ...prevForm,
      customerName: userProfileData.customerName,
      customerPhone: userProfileData.customerPhone,
      customerEmail: userProfileData.customerEmail,
    }));
  }, [userProfileData]);


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });

    // Validate passwords if they are being changed
    if (editForm.newPassword || editForm.currentPassword) {
      if (!editForm.currentPassword) {
        setProfileMessage({ type: 'error', text: 'Current password is required to change password.' });
        return;
      }
      if (editForm.newPassword !== editForm.confirmNewPassword) {
        setProfileMessage({ type: 'error', text: 'New passwords do not match.' });
        return;
      }
      if (editForm.newPassword.length < 6) { // Example password policy
        setProfileMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
        return;
      }
    }

    try {
      // Update basic profile info
      const profileUpdateResponse = await fetch('http://localhost:5000/api/user/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customerId,
          customerName: editForm.customerName,
          customerPhone: editForm.customerPhone,
          customerEmail: editForm.customerEmail,
        }),
      });

      const profileUpdateData = await profileUpdateResponse.json();

      if (!profileUpdateResponse.ok) {
        throw new Error(profileUpdateData.message || 'Failed to update profile.');
      }

      // If password fields are filled, attempt to change password
      if (editForm.currentPassword && editForm.newPassword) {
        const passwordChangeResponse = await fetch('http://localhost:5000/api/user/password/change', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: customerId,
            currentPassword: editForm.currentPassword,
            newPassword: editForm.newPassword,
          }),
        });

        const passwordChangeData = await passwordChangeResponse.json();

        if (!passwordChangeResponse.ok) {
          throw new Error(passwordChangeData.message || 'Failed to change password.');
        }
      }

      // Update local state with new profile data
      setUserProfileData({
        customerName: editForm.customerName,
        customerPhone: editForm.customerPhone,
        customerEmail: editForm.customerEmail,
      });

      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false); // Exit edit mode
      // Clear password fields after successful update
      setEditForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));

    } catch (error) {
      console.error('Error saving profile:', error);
      setProfileMessage({ type: 'error', text: error.message || 'An error occurred while saving profile.' });
    }
  };

  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-gray-800 min-h-screen">
      <nav className="text-xs text-gray-500 mb-6">
        <button onClick={onBackClick} className="hover:underline">Home</button> &gt; <span className="font-semibold">Your Profile</span>
      </nav>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h2>

        {profileMessage.text && (
          <div className={`p-3 mb-4 rounded-md text-sm ${profileMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {profileMessage.text}
          </div>
        )}

        {customerId ? (
          <>
            {!isEditing ? (
              <div className="space-y-4">
                <p className="text-lg">
                  <span className="font-semibold">Username:</span> {username}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Customer Name:</span> {userProfileData.customerName || 'N/A'}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Phone:</span> {userProfileData.customerPhone || 'N/A'}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Email:</span> {userProfileData.customerEmail || 'N/A'}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={editForm.customerName}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    id="customerPhone"
                    name="customerPhone"
                    value={editForm.customerPhone}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={editForm.customerEmail}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Change Password</h3>
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={editForm.currentPassword}
                      onChange={handleEditChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={editForm.newPassword}
                      onChange={handleEditChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      value={editForm.confirmNewPassword}
                      onChange={handleEditChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({ // Reset form to current profile data
                        customerName: userProfileData.customerName,
                        customerPhone: userProfileData.customerPhone,
                        customerEmail: userProfileData.customerEmail,
                        currentPassword: '',
                        newPassword: '',
                        confirmNewPassword: '',
                      });
                      setProfileMessage({ type: '', text: '' }); // Clear messages
                    }}
                    className="px-6 py-2 rounded-full bg-gray-300 text-gray-800 font-semibold shadow-lg hover:bg-gray-400 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700 transition-all duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <p className="text-lg text-red-500">Please sign in to view your profile details.</p>
        )}
        {!isEditing && (
          <button
            onClick={onBackClick}
            className="mt-8 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
};

// New ModifyProductsPage Component for Admin
const ModifyProductsPage = ({ products, fetchProducts, onBackClick }) => {
  const [showProductFormModal, setShowProductFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Product being edited

  const handleAddProductClick = () => {
    setEditingProduct(null); // Clear any product being edited
    setShowProductFormModal(true);
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setShowProductFormModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/delete/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log(`Product ${productId} deleted successfully.`);
          fetchProducts(); // Refresh the product list
        } else {
          const errorData = await response.json();
          console.error('Failed to delete product:', errorData.message || 'Unknown error');
          alert('Failed to delete product: ' + (errorData.message || 'Please try again.'));
        }
      } catch (error) {
        console.error('Network error deleting product:', error);
        alert('Network error deleting product. Please try again later.');
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      let response;
      if (productData.id) { // If productData has an ID, it's an update
        response = await fetch(`http://localhost:5000/api/products/update/${productData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else { // Otherwise, it's a new product
        response = await fetch('http://localhost:5000/api/products/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }

      if (response.ok) {
        console.log('Product saved successfully!');
        setShowProductFormModal(false);
        fetchProducts(); // Refresh the product list
      } else {
        const errorData = await response.json();
        console.error('Failed to save product:', errorData.message || 'Unknown error');
        alert('Failed to save product: ' + (errorData.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Network error saving product:', error);
      alert('Network error saving product. Please try again later.');
    }
  };


  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-gray-800 min-h-screen">
      <nav className="text-xs text-gray-500 mb-6">
        <button onClick={onBackClick} className="hover:underline">Home</button> &gt; <span className="font-semibold">Modify Products</span>
      </nav>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Products</h2>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleAddProductClick}
            className="px-8 py-4 rounded-full bg-green-600 text-white font-semibold text-lg shadow-lg hover:bg-green-700 transition-all duration-300 flex items-center space-x-2"
          >
            <PlusCircle className="w-6 h-6" />
            <span>Add New Product</span>
          </button>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-600">No products available to manage.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-50 p-4 rounded-xl shadow-md w-full max-w-xs">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="rounded-lg mb-3 w-full h-32 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x100/cccccc/333333?text=Image+Error'; }}
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">৳{product.price.toFixed(2)}</p>
                <p className="text-gray-600 text-sm mb-3">Stock: {product.stock || 'N/A'}</p> {/* Display stock */}

                <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEditProductClick(product)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onBackClick}
          className="mt-8 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          Back to Home
        </button>
      </div>

      {showProductFormModal && (
        <ProductFormModal
          onClose={() => setShowProductFormModal(false)}
          onSave={handleSaveProduct}
          productToEdit={editingProduct}
        />
      )}
    </div>
  );
};


// New ProductFormModal Component (for adding and editing products)
const ProductFormModal = ({ onClose, onSave, productToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '', // Assuming category is a string ID or name
    sku: '',
    stock: '', // New field for stock
    tags: '', // Tags as a comma-separated string
  });
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        description: productToEdit.description || '',
        price: productToEdit.price || '',
        imageUrl: productToEdit.imageUrl || '',
        category: productToEdit.category?.name || productToEdit.category || '', // Handle category object or string
        sku: productToEdit.sku || '',
        stock: productToEdit.stock || '',
        tags: Array.isArray(productToEdit.tags) ? productToEdit.tags.join(', ') : productToEdit.tags || '',
      });
    } else {
      // Reset form if no product to edit (for "Add New Product")
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        sku: '',
        stock: '',
        tags: '',
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });

    // Basic validation
    if (!formData.name || !formData.price || !formData.imageUrl || !formData.stock) {
      setFormMessage({ type: 'error', text: 'Please fill in all required fields (Name, Price, Image URL, Stock).' });
      return;
    }
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setFormMessage({ type: 'error', text: 'Price must be a positive number.' });
      return;
    }
    if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      setFormMessage({ type: 'error', text: 'Stock must be a non-negative integer.' });
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Convert tags string to array
      // Assuming category is sent as a string name, backend needs to handle mapping to ID
      category: { name: formData.category } // Sending category as an object with name
    };

    if (productToEdit) {
      productData.id = productToEdit.id; // Add ID for update operation
    }

    onSave(productData); // Call the onSave prop passed from ModifyProductsPage
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-[1001] p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
          aria-label="Close product form"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {productToEdit ? 'Edit Product' : 'Add New Product'}
        </h2>

        {formMessage.text && (
          <div className={`p-3 mb-4 rounded-md text-sm ${formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {formMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (৳)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., fresh, organic, vegetables"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-gray-300 text-gray-800 font-semibold shadow-lg hover:bg-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
            >
              {productToEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
