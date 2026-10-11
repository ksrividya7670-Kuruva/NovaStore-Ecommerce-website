export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80';

export const handleImageError = (e) => {
  e.currentTarget.onerror = null; // Prevent infinite loop if fallback fails
  e.currentTarget.src = FALLBACK_IMAGE;
};
