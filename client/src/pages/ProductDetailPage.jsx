import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Package,
  Plus,
  Minus,
  Heart,
  MessageSquare,
  Send,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { handleImageError } from '../utils/constants';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Marcus Vance',
      rating: 5,
      date: '2 days ago',
      comment: 'Exceptional build quality and premium materials. Exceeded my expectations!'
    },
    {
      id: 2,
      author: 'Sarah Lin',
      rating: 5,
      date: '1 week ago',
      comment: 'Super fast delivery, arrived perfectly packaged. Works exactly as advertised.'
    }
  ]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setQuantity(1);

    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        return fetch(`/api/products?category=${encodeURIComponent(data.category)}&limit=4`);
      })
      .then((res) => res.json())
      .then((relatedData) => {
        if (relatedData?.products) {
          setRelated(relatedData.products.filter((p) => p.id !== parseInt(id)));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity, false);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const newRev = {
      id: Date.now(),
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewText.trim()
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewText('');
    setReviewSubmitted(true);
    showToast({
      title: 'Review Submitted ⭐',
      message: 'Thank you for your valuable feedback!',
      type: 'success'
    });
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 animate-pulse space-y-8">
        <div className="h-6 bg-slate-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-24 bg-slate-200 rounded" />
            <div className="h-12 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-600">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-600">
        <Link to="/" className="hover:text-teal-600">Home</Link>
        <span>/</span>
        <Link to={`/?category=${encodeURIComponent(product.category)}`} className="hover:text-teal-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* Product Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center group">
          <img
            src={product.imageUrl}
            alt={product.title}
            onError={handleImageError}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {product.category}
          </span>

          <button
            onClick={() => toggleWishlist(product)}
            className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-md ${
              isFavorited
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/90 text-slate-700 hover:text-red-500 hover:bg-white'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Title & Rating */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-600">({product.numReviews} customer reviews)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {product.title}
              </h1>
            </div>

            {/* Price & Stock Badge */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-black text-slate-900">
                ${product.price.toFixed(2)}
              </span>

              {isOutOfStock ? (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                  Low Stock: Only {product.stock} units left!
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Controls: Quantity + Add to Cart + Buy Now */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-600 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 hover:scale-[1.01]'
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

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                Instant Checkout
              </button>
            </div>
          </div>

          {/* Perks Guarantee Checklist */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] font-semibold text-slate-600">
              <Truck className="w-4 h-4 mx-auto mb-1 text-teal-600" />
              Express Delivery
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] font-semibold text-slate-600">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-teal-600" />
              1-Year Warranty
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] font-semibold text-slate-600">
              <RotateCcw className="w-4 h-4 mx-auto mb-1 text-teal-600" />
              Easy Returns
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Reviews Section */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              Customer Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">Real verified buyer feedback</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>4.9 / 5 Overall Satisfaction</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Write a review form */}
          <form onSubmit={handleReviewSubmit} className="lg:col-span-5 bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Share Your Experience
            </h3>

            {reviewSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                ✓ Review added below!
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex M."
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Rating</label>
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newReviewRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Comments</label>
              <textarea
                required
                rows={3}
                placeholder="What did you like about this product?"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </form>

          {/* Reviews list */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-white space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{rev.author}</h4>
                      <span className="text-[10px] text-slate-600">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-9">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-extrabold text-slate-900">Similar Products You Might Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
