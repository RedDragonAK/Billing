import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { QRCodeSVG } from 'qrcode.react'

function Receipt() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [code])

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/api/orders/${code}`)
      setOrder(response.data)
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Order not found')
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading order...</div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Receipt Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shop Receipt</h1>
            <p className="text-gray-600">Order Code: <span className="font-semibold text-blue-600">{order.code}</span></p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Customer Name */}
          {order.customerName && (
            <div className="mb-6">
              <p className="text-gray-600">Customer: <span className="font-semibold text-gray-800">{order.customerName}</span></p>
            </div>
          )}

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((orderItem) => (
                <div key={orderItem.id} className="flex justify-between items-center py-2 border-b">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{orderItem.nameSnapshot}</p>
                    <p className="text-sm text-gray-600">
                      ₹{orderItem.priceSnapshot} × {orderItem.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">₹{orderItem.lineTotal.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t-2 pt-4 mb-6">
            <div className="flex justify-between items-center text-2xl font-bold text-gray-800">
              <span>Total Amount:</span>
              <span className="text-blue-600">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold text-gray-800">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Status:</span>
              <span className={`font-semibold ${
                order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* UPI QR Code for Pending UPI Payments */}
          {order.paymentMethod === 'UPI' && order.paymentStatus === 'PENDING' && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Pay via UPI
              </h3>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <QRCodeSVG
                    value={`upi://pay?pa=${import.meta.env.VITE_UPI_ID || 'your-shop@paytm'}&am=${order.totalAmount.toFixed(2)}&tn=${encodeURIComponent(`Order ${order.code}`)}&cu=INR`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-gray-700 text-center mb-2">
                  Scan with GPay, PhonePe, Paytm, or any UPI app
                </p>
                <p className="text-lg font-bold text-blue-600">
                  Amount: ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-semibold mb-2">Instructions:</p>
            <p className="text-blue-700 text-sm">
              Please show this receipt at the counter to collect your order. 
              {order.paymentStatus === 'PENDING' && order.paymentMethod !== 'UPI' && ' Payment will be collected at the counter.'}
              {order.paymentMethod === 'UPI' && order.paymentStatus === 'PENDING' && ' Scan the QR code above to pay, then show this receipt at the counter.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Print Receipt
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Order Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Receipt

