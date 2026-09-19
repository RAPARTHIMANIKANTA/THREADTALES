import React, { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-8 bg-gradient-to-r from-[#7F2347] via-[#9E315A] to-[#7F2347] text-[#FFFDFB] relative overflow-hidden">
      
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F6C6D2]/15 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FFFDFB]/10 border border-[#FFFDFB]/20 text-xs font-semibold tracking-[0.25em] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#F6C6D2]" />
          <span>JOIN THE THREADTALES ATELIER</span>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Receive First Access to Hand-Loomed Drops
          </h2>
          <p className="text-sm sm:text-base text-[#FFFDFB]/80 max-w-xl mx-auto font-normal">
            Subscribers receive private invitations to limited crochet batch drops, editorial lookbooks, and custom commission slots.
          </p>
        </div>

        {subscribed ? (
          <div className="inline-flex items-center space-x-2 px-6 py-4 bg-[#FFFDFB] text-[#7F2347] rounded-full font-serif font-bold text-sm shadow-xl animate-in zoom-in-95 duration-200">
            <Check className="w-5 h-5 text-[#9E315A]" />
            <span>Welcome to the THREADTALES VIP Atelier Guild!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C95C7C]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="w-full pl-12 pr-4 py-4 rounded-full bg-[#FFFDFB] text-[#321D25] placeholder-[#321D25]/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#F6C6D2]"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-[#FFFDFB] hover:bg-[#FCE7ED] text-[#7F2347] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg transition-all whitespace-nowrap"
            >
              SUBSCRIBE
            </button>
          </form>
        )}

        <p className="text-[10px] text-[#F6C6D2] font-semibold uppercase tracking-widest">
          No spam • Unsubscribe anytime • Handcrafted with love
        </p>

      </div>
    </section>
  );
}
