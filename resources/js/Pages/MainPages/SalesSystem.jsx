import React, { useState } from 'react'
import { Plus, Search, TrendingUp, DollarSign, Users, Package, ChevronRight, X } from 'lucide-react'
import NavBar from '@/MainComponents/NavBar'

const SalesSystem = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [products, setProducts] = useState([
    { id: 1, name: 'Premium Headphones', price: 299, stock: 45, sold: 128 },
    { id: 2, name: 'Wireless Mouse', price: 49, stock: 87, sold: 234 },
    { id: 3, name: 'Mechanical Keyboard', price: 159, stock: 32, sold: 89 },
    { id: 4, name: 'USB-C Hub', price: 79, stock: 64, sold: 156 }
  ])

  const stats = {
    revenue: products.reduce((sum, p) => sum + (p.price * p.sold), 0),
    products: products.length,
    customers: 342,
    growth: 23.5
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newProduct = {
      id: products.length + 1,
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      sold: 0
    }
    setProducts([...products, newProduct])
    setShowAddProduct(false)
  }

  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 mt-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-slate-900">Sales</h1>
              <p className="text-sm text-slate-500 mt-1">Manage your business</p>
            </div>
            <button
              onClick={() => setShowAddProduct(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus size={18} />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <DollarSign className="text-emerald-600" size={20} />
              </div>
              <span className="text-xs text-emerald-600 font-medium">+{stats.growth}%</span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Revenue</p>
            <p className="text-2xl font-light text-slate-900">${stats.revenue.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Products</p>
            <p className="text-2xl font-light text-slate-900">{stats.products}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="text-purple-600" size={20} />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Customers</p>
            <p className="text-2xl font-light text-slate-900">{stats.customers}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <TrendingUp className="text-orange-600" size={20} />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">Total Sales</p>
            <p className="text-2xl font-light text-slate-900">{products.reduce((sum, p) => sum + p.sold, 0)}</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-light text-slate-900">Products</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-600 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-600 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-600 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-600 uppercase tracking-wider">Sold</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-600 uppercase tracking-wider">Revenue</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-slate-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{product.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">${product.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.stock > 50 ? 'bg-emerald-50 text-emerald-700' : 
                        product.stock > 20 ? 'bg-orange-50 text-orange-700' : 
                        'bg-red-50 text-red-700'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{product.sold}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">${(product.price * product.sold).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-900 transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAddProduct(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-2xl font-light text-slate-900 mb-6">Add Product</h3>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-600 mb-2">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  required
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-600 mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default SalesSystem