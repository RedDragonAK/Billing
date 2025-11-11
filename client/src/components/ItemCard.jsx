function ItemCard({ item, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(item.name)
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">₹{item.price}</span>
          <button
            onClick={onAddToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemCard


