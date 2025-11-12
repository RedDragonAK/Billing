import { useState, useEffect } from 'react'
import api from '../utils/api'

function Admin() {
  const [adminKey, setAdminKey] = useState('')
  const [orders, setOrders] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchCode, setSearchCode] = useState('')
  const [activeTab, setActiveTab] = useState('orders') // 'orders' or 'notifications'

  const fetchOrders = async () => {
    if (!adminKey.trim()) {
      setError('Please enter admin key')
      return
    }

    setLoading(true)
    setError('')

    try {
      const [ordersRes, notificationsRes] = await Promise.all([
        api.get('/api/admin/orders', {
          headers: { 'x-admin-key': adminKey }
        }),
        api.get('/api/admin/notifications', {
          headers: { 'x-admin-key': adminKey }
        })
      ])
      setOrders(ordersRes.data)
      setNotifications(notificationsRes.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data')
      setOrders([])
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      const response = await api.patch(
        `/api/admin/orders/${orderId}/status`,
        { paymentStatus: newStatus },
        {
          headers: {
            'x-admin-key': adminKey
          }
        }
      )
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? response.data : order
        )
      )
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status')
    }
  }

  const filteredOrders = searchCode
    ? orders.filter(order => order.code.toLowerCase().includes(searchCode.toLowerCase()))
    : orders

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 font-semibold relative ${
              activeTab === 'notifications'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Notifications
            {notifications.filter(n => n.status === 'SENT').length > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                {notifications.filter(n => n.status === 'SENT').length}
              </span>
            )}
          </button>
        </div>

        {/* Admin Key Input */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load Orders'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map(notif => (
                  <div key={notif.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          Order {notif.order.code}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        notif.status === 'SENT'
                          ? 'bg-green-100 text-green-800'
                          : notif.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {notif.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No notifications yet</p>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {/* Search */}
            {orders.length > 0 && (
              <div className="mb-4">
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Search by order code..."
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Orders List */}
            {orders.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold text-blue-600">{order.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.customerName || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {order.items.length} item(s)
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">₹{order.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {order.paymentStatus === 'PENDING' ? (
                          <button
                            onClick={() => updatePaymentStatus(order.id, 'PAID')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <button
                            onClick={() => updatePaymentStatus(order.id, 'PENDING')}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                          >
                            Mark Pending
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

            {orders.length === 0 && !loading && adminKey && (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Admin

