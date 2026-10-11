import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingCart, Check, Heart, ShieldCheck, Truck, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { handleImageError } from '../utils/constants';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-600 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square sm:aspect-auto bg-slate-100 flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.title}
              onError={handleImageError}
              className="w-full h-full object-cover object-center"
            />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
              {product.category}
            </span>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                  <span className="text-xs text-slate-600">({product.numReviews} reviews)</span>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-1.5 rounded-full border transition-all ${
                    isFavorited
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-slate-200 text-slate-600 hover:text-red-500'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                {product.title}
              </h3>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-600">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-600">Only {product.stock} left</span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> In Stock ({product.stock})
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Controls */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Quantity</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-600 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart (${(product.price * quantity).toFixed(2)})
                  </>
                )}
              </button>

              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="block text-center text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline pt-1"
              >
                View Full Product Details & Specs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
