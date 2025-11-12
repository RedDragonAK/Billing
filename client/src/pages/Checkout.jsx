import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../utils/api'
import { QRCodeSVG } from 'qrcode.react'

function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [cart, setCart] = useState(location.state?.cart || [])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/')
    }
  }, [cart, navigate])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Generate UPI payment URL
  const getUPIUrl = () => {
    const upiId = import.meta.env.VITE_UPI_ID || 'your-shop@paytm' // Default fallback
    console.log('UPI ID from env:', upiId) // Debug: Check if env variable is loading
    const amount = total.toFixed(2)
    const orderNote = `Order Payment - ${customerName || 'Customer'}`
    return `upi://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(orderNote)}&cu=INR`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/api/orders', {
        items: cart,
        paymentMethod,
        customerName: customerName.trim() || null,
        customerPhone: customerPhone.trim() || null,
        customerEmail: customerEmail.trim() || null
      })

      navigate(`/order/${response.data.code}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.')
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48x48?text=' + encodeURIComponent(item.name)
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center text-xl font-bold text-gray-800">
              <span>Total Amount:</span>
              <span className="text-blue-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Optional - for order updates)
            </label>
            <input
              type="tel"
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email (Optional - for order updates)
            </label>
            <input
              type="email"
              id="customerEmail"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH"
                  checked={paymentMethod === 'CASH'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 w-5 h-5 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Cash</div>
                  <div className="text-sm text-gray-600">Pay at the counter</div>
                </div>
              </label>
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 w-5 h-5 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Card</div>
                  <div className="text-sm text-gray-600">Pay by card at the counter</div>
                </div>
              </label>
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 w-5 h-5 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">UPI / GPay / PhonePe</div>
                  <div className="text-sm text-gray-600">Scan QR code to pay online</div>
                </div>
              </label>
            </div>
          </div>

          {/* UPI QR Code */}
          {paymentMethod === 'UPI' && (
            <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Scan QR Code to Pay
              </h3>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <QRCodeSVG
                    value={getUPIUrl()}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-gray-700 text-center mb-2">
                  Scan with GPay, PhonePe, Paytm, or any UPI app
                </p>
                <p className="text-lg font-bold text-blue-600">
                  Amount: ₹{total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  After payment, click "Place Order" to confirm
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Menu
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout

