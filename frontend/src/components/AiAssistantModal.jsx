import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Bot, Sparkles, ShoppingBag, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { askAiAssistant } from '../services/api';
import { PRODUCTS } from '../data/products';

export default function AiAssistantModal({ isOpen, onClose, initialQuery = '' }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hello! I'm the THREADTALES Personal Stylist & Atelier Concierge. Ask me about our handcrafted crochet creations, prices, occasions, materials, sizes, or availability.",
      products: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Show gifts under ₹500',
    'What products are available?',
    'Show birthday gifts',
    'Show keychains'
  ];

  // Auto scroll to bottom when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // If initialQuery is passed when modal opens, handle sending it automatically
  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [isOpen, initialQuery]);

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputValue;
    if (!textToSend || !textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: textToSend.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputValue('');
    setIsLoading(true);

    try {
      const res = await askAiAssistant(textToSend.trim());
      const productIds = Array.isArray(res.productIds) ? res.productIds : [];
      const products = productIds
        .map((productId) => PRODUCTS.find((product) => product.id === productId))
        .filter(Boolean);
      
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: res.answer || "That information is not specified in our current THREADTALES atelier collection.",
        products,
        sources: res.sources || []
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("AI Assistant query error:", err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I encountered a connection issue while searching our THREADTALES product collection. Please try again in a moment.",
        products: []
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#301B25]/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div 
        className="bg-[#FFFDFB] w-full max-w-2xl h-[90vh] max-h-[680px] rounded-3xl shadow-2xl border border-[#F7C9D5] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#FFFDFB] via-[#FFF7F9] to-[#FFFDFB] border-b border-[#F7C9D5] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#9D3158] text-[#FFFDFB] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-lg font-bold text-[#301B25]">THREADTALES AI</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#9D3158]/10 text-[#9D3158] text-[10px] font-bold tracking-wider uppercase">
                  ATELIER CONCIERGE
                </span>
              </div>
              <p className="text-xs text-[#301B25]/70">Personal Styling & Product Advisor</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-[#F7C9D5]/30 border border-[#F7C9D5]/60 text-[#301B25] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FFFDFB]">
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start space-x-2.5 max-w-[88%] sm:max-w-[80%]">
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#9D3158]/15 text-[#9D3158] flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div 
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#9D3158] text-[#FFFDFB] rounded-tr-none'
                      : 'bg-[#FFF7F9] border border-[#F7C9D5]/80 text-[#301B25] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>

              {/* Render Recommended Product Cards if attached to assistant message */}
              {msg.sender === 'assistant' && msg.products && msg.products.length > 0 && (
                <div className="mt-4 w-full pl-9 pr-2">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#9D3158] block mb-2.5">
                    Recommended Products ({msg.products.length})
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {msg.products.map((product) => (
                      <div 
                        key={product.id}
                        className="bg-white rounded-2xl border border-[#F7C9D5]/80 p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div className="flex space-x-3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-xl border border-[#F7C9D5]/40 shrink-0 bg-[#FFF7F9]" 
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-bold text-xs text-[#301B25] truncate group-hover:text-[#9D3158] transition-colors">
                              {product.name}
                            </h4>
                            <span className="text-[10px] text-[#C65A7B] font-semibold block uppercase">
                              {product.category}
                            </span>
                            <div className="mt-1 flex items-baseline justify-between">
                              <span className="font-serif font-bold text-sm text-[#301B25]">
                                ₹{product.price}
                              </span>
                              {product.availability !== undefined && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  product.availability > 0 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {product.availability > 0 ? `In Stock (${product.availability})` : 'Out of stock'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleProductClick(product.id)}
                          className="mt-3 w-full py-1.5 bg-[#FFF7F9] hover:bg-[#9D3158] text-[#70213F] hover:text-white border border-[#F7C9D5] rounded-xl text-xs font-semibold tracking-wider transition-colors flex items-center justify-center space-x-1"
                        >
                          <span>View Product</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Loading Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-3 text-xs text-[#70213F] bg-[#FFF7F9] p-3 rounded-2xl border border-[#F7C9D5]/70 max-w-xs">
              <div className="w-5 h-5 border-2 border-[#9D3158] border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium">Searching THREADTALES collection...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Prompts inside modal if history is short */}
        {messages.length <= 2 && !isLoading && (
          <div className="px-6 py-2 bg-[#FFF7F9] border-t border-[#F7C9D5]/40 flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-[#C65A7B] uppercase shrink-0">Try:</span>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1 rounded-full bg-white hover:bg-[#F7C9D5]/30 border border-[#F7C9D5] text-[11px] font-medium text-[#70213F] shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Footer Input Form */}
        <div className="p-4 bg-[#FFFDFB] border-t border-[#F7C9D5] shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about products, prices, occasions, materials..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#FFF7F9] border border-[#F7C9D5] rounded-2xl text-xs font-medium text-[#301B25] placeholder-[#301B25]/50 focus:outline-none focus:border-[#9D3158] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="w-11 h-11 bg-[#9D3158] hover:bg-[#70213F] disabled:opacity-40 text-white rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-[#301B25]/50 font-normal">
              THREADTALES Official Atelier Concierge • Personal Styling & Gift Advisor
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
