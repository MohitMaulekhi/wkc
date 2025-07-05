import { useState, useEffect } from "react";
import { useAuth } from "../context/UseAuth";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import toast from "react-hot-toast";
import InventoryHeader from "../components/inventory/InventoryHeader";
import ProductForm from "../components/inventory/ProductForm";
import ProductGrid from "../components/inventory/ProductGrid";
import InventoryEmptyState from "../components/inventory/InventoryEmptyState";
import { useSearchParams } from "react-router-dom";
import { Star, Filter } from "lucide-react";

const Inventory = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    sku: "",
  });
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [currentUser]);

  // Handle edit from URL parameter
  useEffect(() => {
    const editProductId = searchParams.get('edit');
    if (editProductId && products.length > 0) {
      const productToEdit = products.find(p => p.id === editProductId);
      if (productToEdit) {
        handleEdit(productToEdit);
      }
    }
  }, [searchParams, products]);

  const fetchProducts = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        userId: currentUser.uid,
        userType: currentUser.userType,
        companyName: currentUser.companyName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), {
          ...productData,
          updatedAt: new Date().toISOString(),
        });
        toast.success("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), productData);
        toast.success("Product added successfully!");
      }
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        sku: "",
      });
      setShowAddForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
      sku: product.sku,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", productId));
        toast.success("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      sku: "",
    });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  // Filter products based on searchValue
  const filteredProducts = products.filter(product => {
    const q = searchValue.toLowerCase();
    return (
      product.name?.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q) ||
      product.sku?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InventoryHeader
          currentUser={currentUser}
          products={filteredProducts}
          onAddProduct={() => setShowAddForm(true)}
          searchValue={searchValue}
          onSearch={setSearchValue}
        />
        {showAddForm && (
          <ProductForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            editingProduct={editingProduct}
          />
        )}
        {filteredProducts.length === 0 ? (
          <InventoryEmptyState onAddProduct={() => setShowAddForm(true)} />
        ) : (
          <ProductGrid
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Inventory; 