import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { handleImageError } from '../utils/constants';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, 1, false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5 relative">
      {/* Product Image Area */}
      <div className="relative block aspect-square overflow-hidden bg-slate-100">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.title}
            onError={handleImageError}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm pointer-events-none">
          {product.category}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${
            isFavorited
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/90 text-slate-600 hover:text-red-500 hover:bg-white hover:scale-110'
          }`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button (hover reveal) */}
        <button
          onClick={handleQuickViewClick}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/95 backdrop-blur-md text-slate-800 hover:bg-teal-600 hover:text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>

        {/* Stock Badges */}
        {isOutOfStock ? (
          <span className="absolute bottom-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="absolute bottom-3 left-3 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            Only {product.stock} left
          </span>
        ) : null}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-[11px] text-slate-600">({product.numReviews})</span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-2 hover:text-teal-600 transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider block">
              Price
            </span>
            <span className="text-lg font-black text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-600 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white scale-95 shadow-emerald-600/20'
                : 'bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white hover:shadow-teal-600/20'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : isOutOfStock ? (
              <span>Sold Out</span>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
