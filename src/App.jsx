import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inventory from "./pages/seller/Inventory";
import ProductDetail from "./pages/seller/ProductDetail";
import Category from "./pages/seller/Category";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/seller/Profile";
import Chatbot from "./components/Chatbot";
import Cart from "./pages/walmart/Cart";
import Order from "./pages/walmart/Order";
import MyOrders from "./pages/walmart/MyOrders";
import WalmartProfile from "./pages/walmart/Profile";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerChat from "./pages/seller/Chat";
import BuyerChat from "./pages/walmart/Chat";
import ChatDemo from "./components/chat/ChatDemo";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster/>
      <AuthProvider>
        <ChatProvider>
          <BrowserRouter>
            <Header />
            <main className="flex-1">
              <Routes>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/chat-demo" element={<ChatDemo />} />
                
                {/* Seller Routes */}
                <Route 
                  path="/seller" 
                  element={
                    <ProtectedRoute>
                      <Outlet />
                    </ProtectedRoute>
                  } 
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  <Route path="category/:categoryName" element={<Category />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="order" element={<SellerOrders />} />
                  <Route path="chat" element={<SellerChat />} />
                </Route>

                {/* Walmart Routes */}
                <Route 
                  path="/walmart" 
                  element={
                    <ProtectedRoute>
                      <Outlet />
                    </ProtectedRoute>
                  } 
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="order" element={<Order />} />
                  <Route path="myOrders" element={<MyOrders />} />
                  <Route path="profile" element={<WalmartProfile />} />
                  <Route path="chat" element={<BuyerChat />} />
                </Route>

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Outlet />
                  </ProtectedRoute>
                } 
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route index element={<Admin />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </div>
  );
};

export default App;