import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CraftedStorySection from '../components/CraftedStorySection';
import FeaturedCollection from '../components/FeaturedCollection';
import NewsletterSection from '../components/NewsletterSection';
import AiLandingSection from '../components/AiLandingSection';

export default function HomePage({ onSelectProduct, onAddToCart, onToggleWishlist, wishlistIds, onOpenAi }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-0">
      {/* Hero Section with Signature Text-Free Real Yarn Ball */}
      <HeroSection
        onOpenStory={() => navigate('/about')}
        onExploreClick={() => navigate('/shop')}
      />

      {/* Crafted with a Story Intro */}
      <CraftedStorySection
        onOpenStory={() => navigate('/about')}
      />

      {/* Featured Collection Teaser */}
      <FeaturedCollection
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistIds={wishlistIds}
      />

      {/* THREADTALES RAG AI Product Assistant Landing Section */}
      <AiLandingSection
        onOpenAiWithQuery={(query) => onOpenAi && onOpenAi(query)}
      />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
