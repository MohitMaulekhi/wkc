import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inventory from "./pages/seller/Inventory";
import ProductDetail from "./pages/seller/ProductDetail";
import Category from "./pages/seller/Category";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/seller/Profile";
import Chatbot from "./components/Chatbot";
import Cart from "./pages/walmart/Cart";
import Order from "./pages/walmart/Order";
import MyOrders from "./pages/walmart/MyOrders";
import SellerOrders from "./pages/seller/SellerOrders";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster/>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <main className="flex-1">
            <Routes>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route 
                path="/seller/inventory" 
                element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller/product/:id" 
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/seller/category/:categoryName" 
                element={<Category />} 
              />
              <Route
              path="/seller/order" 
                element={<SellerOrders/>} 
              />
              <Route 
                path="/seller/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Routes for walmart*/}

              <Route 
                path="/walmart/cart" 
                element={
                <ProtectedRoute>
                <Cart />
                </ProtectedRoute>
                } 
              />
              <Route 
                path="/walmart/order" 
                
                element={<ProtectedRoute><Order/> </ProtectedRoute>} 
              />
              <Route
              path="/walmart/myOrders"
              element={
                <ProtectedRoute>
                  <MyOrders/>
                </ProtectedRoute>
              }
              />
              <Route 
                path="/walmart/profile" 
                element={ <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>} 
              />
              
              <Route path="*" element={<NotFound />} />

              </Routes>
            
          </main>
          <Footer />
          <Chatbot />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
