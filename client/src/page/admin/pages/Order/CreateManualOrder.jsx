import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../../../../Common/api";
import { config } from "../../../../Common/configurations";
import toast from "react-hot-toast";
import BreadCrumbs from "../../Components/BreadCrumbs";
import { BsTrash, BsPlusCircle } from "react-icons/bs";
import Loading from "../../../../components/Loading";

const CreateManualOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(true);

  // Form State
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [address, setAddress] = useState({
    address: "",
    city: "",
    regionState: "",
    country: "India",
    pinCode: "",
  });

  const [selectedProducts, setSelectedProducts] = useState([
    { productId: "", quantity: 1, name: "", price: 0 }
  ]);

  const [paymentMode, setPaymentMode] = useState("cashOnDelivery");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [shipping, setShipping] = useState(0);
  const [notes, setNotes] = useState("");

  // Fetch all products for selection
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${URL}/admin/products?limit=100`, config);
        setProducts(res.data.products);
        setFetchingProducts(false);
      } catch (err) {
        console.error("Failed to fetch products", err);
        toast.error("Failed to load products");
        setFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (index, productId) => {
    const product = products.find(p => p._id === productId);
    const updated = [...selectedProducts];
    updated[index] = {
      ...updated[index],
      productId,
      name: product?.name || "",
      price: product?.price || 0
    };
    setSelectedProducts(updated);
  };

  const handleQuantityChange = (index, qty) => {
    const updated = [...selectedProducts];
    updated[index].quantity = parseInt(qty) || 1;
    setSelectedProducts(updated);
  };

  const addProductRow = () => {
    setSelectedProducts([...selectedProducts, { productId: "", quantity: 1, name: "", price: 0 }]);
  };

  const removeProductRow = (index) => {
    if (selectedProducts.length === 1) return;
    const updated = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updated);
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!customerInfo.firstName || !customerInfo.email || !address.address) {
      return toast.error("Please fill in required customer details");
    }

    const validProducts = selectedProducts.filter(p => p.productId);
    if (validProducts.length === 0) {
      return toast.error("Please select at least one product");
    }

    setLoading(true);
    try {
      const payload = {
        customerInfo,
        address,
        products: validProducts,
        paymentMode,
        paymentStatus,
        shipping: parseFloat(shipping) || 0,
        notes
      };

      const res = await axios.post(`${URL}/admin/order/manual`, payload, config);
      toast.success("Order created successfully!");
      navigate(`/admin/order/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProducts) return <Loading />;

  return (
    <div className="p-5 w-full min-h-screen bg-gray-50 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="font-bold text-2xl">Create Manual Order</h1>
          <BreadCrumbs list={["Dashboard", "Orders", "Create"]} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer & Address */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="font-bold text-lg mb-4 text-gray-800">Customer Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">First Name *</label>
                  <input 
                    type="text" required
                    className="w-full px-3 py-2 border rounded-md outline-none focus:ring-1 focus:ring-black"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Last Name</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border rounded-md outline-none focus:ring-1 focus:ring-black"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Email *</label>
                <input 
                  type="email" required
                  className="w-full px-3 py-2 border rounded-md outline-none focus:ring-1 focus:ring-black"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                />
              </div>
              <div className="mt-4 space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border rounded-md outline-none focus:ring-1 focus:ring-black"
                  value={customerInfo.phoneNumber}
                  onChange={(e) => setCustomerInfo({...customerInfo, phoneNumber: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="font-bold text-lg mb-4 text-gray-800">Shipping Address</h2>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Address *</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 border rounded-md outline-none focus:ring-1 focus:ring-black"
                  value={address.address}
                  onChange={(e) => setAddress({...address, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">City *</label>
                  <input 
                    type="text" required
                    className="w-full px-3 py-2 border rounded-md outline-none focus:ring-1 focus:ring-black"
                    value={address.city}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">State/Region *</label>
                  <input 
                    type="text" required
                    className="w-full px-3 py-2 border rounded-md outline-none focus:ring-1 focus:ring-black"
                    value={address.regionState}
                    onChange={(e) => setAddress({...address, regionState: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Pincode *</label>
                  <input 
                    type="text" required
                    className="w-full px-3 py-2 border rounded-md outline-none focus:ring-1 focus:ring-black"
                    value={address.pinCode}
                    onChange={(e) => setAddress({...address, pinCode: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Country</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border rounded-md outline-none focus:ring-1 focus:ring-black"
                    value={address.country}
                    onChange={(e) => setAddress({...address, country: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-gray-800">Products</h2>
              <button 
                type="button" 
                onClick={addProductRow}
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                <BsPlusCircle /> Add Product
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100 pb-2">
                    <th className="py-2 text-xs font-bold text-gray-400 uppercase">Product</th>
                    <th className="py-2 text-xs font-bold text-gray-400 uppercase w-24 text-center">Qty</th>
                    <th className="py-2 text-xs font-bold text-gray-400 uppercase text-right">Price</th>
                    <th className="py-2 text-xs font-bold text-gray-400 uppercase text-right">Total</th>
                    <th className="py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedProducts.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3">
                        <select 
                          className="w-full p-2 border border-gray-100 rounded-md outline-none text-sm"
                          value={item.productId}
                          onChange={(e) => handleProductChange(index, e.target.value)}
                        >
                          <option value="">Select a product...</option>
                          {products.map(p => (
                            <option key={p._id} value={p._id}>{p.name} (₹{p.price})</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input 
                          type="number" min="1"
                          className="w-full p-2 border border-gray-100 rounded-md text-center text-sm"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                        />
                      </td>
                      <td className="py-3 text-right text-sm font-medium text-gray-600">
                        ₹{item.price}
                      </td>
                      <td className="py-3 text-right text-sm font-bold text-gray-800">
                        ₹{item.price * item.quantity}
                      </td>
                      <td className="py-3 text-right">
                        <button 
                          type="button" 
                          onClick={() => removeProductRow(index)}
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          <BsTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer: Notes & Total */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="font-bold text-lg mb-4 text-gray-800">Additional Notes</h2>
              <textarea 
                className="w-full h-32 p-3 border rounded-md outline-none focus:ring-1 focus:ring-black resize-none text-sm"
                placeholder="Internal notes or delivery instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <h2 className="font-bold text-lg mb-4 text-gray-800">Order Summary</h2>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Shipping</span>
                <input 
                  type="number"
                  className="w-20 p-1 border border-gray-100 rounded text-right outline-none focus:border-black"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                />
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-black">₹{calculateSubtotal() + (parseFloat(shipping) || 0)}</span>
              </div>

              <div className="pt-4 space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Payment Status</label>
                  <select 
                    className="w-full p-2 border rounded-md text-sm outline-none"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option value="pending">Pending / COD</option>
                    <option value="success">Paid / Received</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all disabled:bg-gray-400"
                >
                  {loading ? "Creating Order..." : "Finalize & Create Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManualOrder;
