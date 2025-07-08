import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inventory from "./pages/Inventory";
import ProductDetail from "./pages/ProductDetail";
import Category from "./pages/Category";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import Chatbot from "./components/Chatbot";

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
                path="/seller/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
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
