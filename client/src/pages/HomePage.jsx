import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  RefreshCw,
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  Package,
  Heart,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { useWishlist } from '../context/WishlistContext';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'catalog'); // 'catalog' or 'wishlist'
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // Hero Carousel items
  const heroSlides = [
    {
      badge: 'Flagship Audio Release',
      title: 'Sony WH-1000XM5 Studio Wireless',
      desc: '30-hour battery life, 8 noise-cancelling mics, and ultra-comfortable soft fit leather.',
      price: '$349.99',
      category: 'Audio',
      bgGradient: 'from-slate-950 via-teal-950 to-slate-900',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    },
    {
      badge: 'Pro Performance Silicon',
      title: 'Apple MacBook Air 15" M3 Chip',
      desc: 'Liquid Retina display, MagSafe 3 charging, 16GB unified memory, and all-day battery.',
      price: '$1299.00',
      category: 'Electronics',
      bgGradient: 'from-blue-950 via-slate-900 to-teal-950',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    },
    {
      badge: 'Next-Gen Gaming',
      title: 'Sony PS5 DualSense Controller',
      desc: 'Haptic feedback triggers and immersive motion controls in ergonomic midnight black.',
      price: '$69.99',
      category: 'Gaming',
      bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
    }
  ];

  // Auto rotate hero slide
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Fetch categories
  useEffect(() => {
    fetch('/api/products/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(['All', ...data]);
        }
      })
      .catch((err) => console.error('Error fetching categories', err));
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          query.set('category', selectedCategory);
        }
        if (search) {
          query.set('search', search);
        }
        if (sort) {
          query.set('sort', sort);
        }
        if (maxPrice < 1500) {
          query.set('maxPrice', maxPrice);
        }

        const res = await fetch(`/api/products?${query.toString()}`);
        const data = await res.json();
        let list = data.products || [];

        if (onlyInStock) {
          list = list.filter((p) => p.stock > 0);
        }

        setProducts(list);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, sort, search, maxPrice, onlyInStock]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setActiveTab('catalog');
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const displayedProducts = activeTab === 'wishlist' ? wishlist : products;

  return (
    <div className="space-y-10 pb-16">
      {/* Interactive Hero Carousel */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl transition-all duration-700">
        <div
          className={`p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-r ${heroSlides[activeHeroSlide].bgGradient} transition-colors duration-700`}
        >
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold backdrop-blur-md border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{heroSlides[activeHeroSlide].badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {heroSlides[activeHeroSlide].title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {heroSlides[activeHeroSlide].desc}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="text-2xl font-black text-white">
                {heroSlides[activeHeroSlide].price}
              </span>
              <button
                onClick={() => handleCategorySelect(heroSlides[activeHeroSlide].category)}
                className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-xl shadow-teal-500/25 transition-all hover:scale-105"
              >
                Explore Category
              </button>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 sm:w-80 aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src={heroSlides[activeHeroSlide].image}
                alt={heroSlides[activeHeroSlide].title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                <span className="text-xs font-extrabold text-white">
                  🔥 Trending in {heroSlides[activeHeroSlide].category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-8 sm:left-12 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveHeroSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                activeHeroSlide === idx ? 'w-8 bg-teal-400' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Main Catalog View Controls */}
      <section id="catalog" className="space-y-6">
        {/* Tab Toggle: Catalog vs Wishlist */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Catalog Items ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'wishlist'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlist.length > 0 ? 'fill-current' : ''}`} />
              <span>Favorites & Wishlist ({wishlist.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <span>Showing:</span>
            <span className="font-bold text-slate-900">{displayedProducts.length} products</span>
          </div>
        </div>

        {/* Filter Controls Row */}
        {activeTab === 'catalog' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sub-Filters: Search + Max Price Slider + In-Stock Toggle + Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-100 items-center">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-2.5" />
              </div>

              {/* Price Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>Max Price:</span>
                  <span className="text-teal-700 font-black">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              {/* In-stock Only Toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                />
                <span>In-Stock Only</span>
              </label>

              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2 pl-3 pr-8 rounded-xl outline-none focus:bg-white focus:border-teal-500 cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Customer Rating</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-600 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-4 animate-pulse space-y-4">
                <div className="aspect-square bg-slate-200 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-600">
              {activeTab === 'wishlist' ? <Heart className="w-8 h-8" /> : <Search className="w-8 h-8" />}
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              {activeTab === 'wishlist' ? 'Your wishlist is empty' : 'No matching products'}
            </h3>
            <p className="text-xs text-slate-600">
              {activeTab === 'wishlist'
                ? 'Tap the heart icon on any product to save it here for later.'
                : 'Try adjusting your search query, price slider, or category filter.'}
            </p>
            {activeTab === 'catalog' && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearch('');
                  setMaxPrice(1500);
                  setOnlyInStock(false);
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick View Modal Popup */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
