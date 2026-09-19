import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle, Sparkles, Wand2, Palette, Calendar, Package, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import { supabase } from '../lib/supabase';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('general'); // 'general' or 'custom'
  const [submittedGeneral, setSubmittedGeneral] = useState(false);
  const [submittedCustom, setSubmittedCustom] = useState(false);
  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [loadingCustom, setLoadingCustom] = useState(false);

  // General Form State
  const [generalData, setGeneralData] = useState({
    name: '',
    email: '',
    subject: 'General Enquiry',
    message: ''
  });

  // Custom Product Request Form State
  const [customData, setCustomData] = useState({
    name: '',
    email: '',
    phone: '',
    productType: 'Bags',
    colorPalette: 'Dusk Pink & Cream',
    targetDate: '',
    quantity: '1',
    customNotes: ''
  });

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setLoadingGeneral(true);
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([{
          name: generalData.name,
          email: generalData.email,
          subject: generalData.subject,
          message: generalData.message
        }]);

      if (error) {
        console.error('Supabase contact_inquiries insert error:', error);
      }
    } catch (err) {
      console.error('Save general inquiry error:', err);
    } finally {
      setLoadingGeneral(false);
      setSubmittedGeneral(true);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    setLoadingCustom(true);
    try {
      const { error } = await supabase
        .from('custom_product_requests')
        .insert([{
          name: customData.name,
          email: customData.email,
          phone: customData.phone,
          product_type: customData.productType,
          color_palette: customData.colorPalette,
          target_date: customData.targetDate || null,
          quantity: parseInt(customData.quantity) || 1,
          custom_notes: customData.customNotes
        }]);

      if (error) {
        console.error('Supabase custom_product_requests insert error:', error);
      }
    } catch (err) {
      console.error('Save custom product request error:', err);
    } finally {
      setLoadingCustom(false);
      setSubmittedCustom(true);
    }
  };

  const subjectOptions = [
    { value: 'General Enquiry', label: 'General Inquiry' },
    { value: 'Order Tracking', label: 'Order & Shipping Status' },
    { value: 'Care Advice', label: 'Yarn Care & Maintenance' },
    { value: 'Press', label: 'Press & Media Inquiry' }
  ];

  const productCategoryOptions = [
    { value: 'Bags', label: 'Crochet Fashion Bag / Tote' },
    { value: 'Bouquets', label: 'Everlasting Flower Bouquet' },
    { value: 'Keychains', label: 'Custom Keychain / Set' },
    { value: 'Accessories', label: 'Hair Clip / Bow Hair Tie' },
    { value: 'Home Decor', label: 'Hanging Planter / Wall Decor' },
    { value: 'Wedding Bulk', label: 'Bulk Event / Wedding Favors' }
  ];

  const colorPaletteOptions = [
    { value: 'Dusk Pink & Cream', label: 'Signature Dusk Pink & Cream' },
    { value: 'Crimson Red & Leaf Green', label: 'Deep Crimson Red & Green' },
    { value: 'Pastel Lavender & White', label: 'Soft Pastel Lavender & White' },
    { value: 'Sunflower Yellow & Orange', label: 'Vibrant Sunflower Yellow' },
    { value: 'Custom Palette', label: 'Custom Colors (Specify Below)' }
  ];

  const faqs = [
    {
      q: "How long does a custom handmade crochet order take?",
      a: "Custom crochet orders typically take 3 to 7 business days to hand-loop and finish, depending on complexity (e.g. keychains take 2-3 days, while complex rose shoulder bags and large bouquets take 5-7 days)."
    },
    {
      q: "Can I request custom yarn colors or embroidered initials?",
      a: "Yes! We offer full color customization using our premium cotton and acrylic yarn palette. We can also weave custom initials, pearls, or specific flower varieties into your piece."
    },
    {
      q: "Do you accept bulk custom orders for weddings and gifting events?",
      a: "Absoluty. We specialize in custom crochet gift sets, bridal party flower bouquets, and personalized event keychains. Please submit your request at least 2-3 weeks before your event date."
    },
    {
      q: "Will I receive photos before my custom order is shipped?",
      a: "Yes! Once your bespoke piece is finished, our atelier will send high-resolution photos of your completed item for final approval before packaging."
    }
  ];

  return (
    <div className="pt-32 pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-16 relative overflow-hidden">
      
      {/* Background Lighting Glows */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#F7C9D5]/30 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto relative z-10">
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#FFFDFB] border border-[#F7C9D5] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#9D3158]" />
          <span className="font-serif text-xs font-bold tracking-[0.3em] text-[#70213F] uppercase">
            ATELIER CONCIERGE & BESPOKE STUDIO
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#301B25]">
          Get in Touch with THREADTALES
        </h1>

        <p className="text-sm sm:text-base text-[#301B25]/75 leading-relaxed font-normal">
          Whether you need assistance with an existing order or want to commission a 1-of-1 bespoke crochet creation, our atelier is at your service.
        </p>

        <div className="w-16 h-0.5 bg-[#C65A7B] mx-auto rounded-full mt-2"></div>
      </div>

      {/* Main Interactive Tab Switcher */}
      <div className="max-w-xl mx-auto bg-[#FFFDFB] p-2 rounded-full border border-[#F7C9D5] shadow-sm flex items-center justify-center space-x-2 relative z-10">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-3 px-6 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'general'
              ? 'bg-[#9D3158] text-[#FFFDFB] shadow-md shadow-[#9D3158]/20'
              : 'text-[#301B25]/70 hover:bg-[#FFF7F9] hover:text-[#70213F]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>General Inquiry</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-3 px-6 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'custom'
              ? 'bg-[#9D3158] text-[#FFFDFB] shadow-md shadow-[#9D3158]/20'
              : 'text-[#301B25]/70 hover:bg-[#FFF7F9] hover:text-[#70213F]'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>Custom Product Request</span>
        </button>
      </div>

      {/* Tab 1: General Studio Inquiry */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-300 relative z-10">
          
          {/* Left Column: Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFDFB] p-8 rounded-3xl border border-[#F7C9D5]/60 shadow-sm space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#70213F]">Studio Concierge</h3>

              <div className="space-y-4 text-xs text-[#301B25]/80">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#9D3158] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#301B25]">THREADTALES Atelier Studio</span>
                    <span>742 Rue Saint-Honoré, Paris & Flagship Atelier Studio</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#9D3158] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#301B25]">Email Concierge</span>
                    <span>concierge@threadtales.com</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#9D3158] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#301B25]">Direct Telephone / WhatsApp</span>
                    <span>+1 (800) 482-LOOM</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#9D3158] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#301B25]">Concierge Hours</span>
                    <span>Monday – Saturday: 9:00 AM – 7:00 PM EST</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF7F9] p-6 rounded-3xl border border-[#F7C9D5]/60 space-y-2">
              <span className="text-[10px] font-bold tracking-widest text-[#9D3158] uppercase block">
                Direct Custom Commissions
              </span>
              <h4 className="font-serif font-bold text-base text-[#301B25]">Want a custom crochet piece?</h4>
              <p className="text-xs text-[#301B25]/70">
                Switch to our <strong className="text-[#9D3158]">Custom Product Request</strong> tab above to configure your bespoke yarn color, bouquet size, or bag design.
              </p>
            </div>
          </div>

          {/* Right Column: General Form */}
          <div className="lg:col-span-7 bg-[#FFFDFB] p-8 sm:p-10 rounded-3xl border border-[#F7C9D5]/60 shadow-sm">
            {submittedGeneral ? (
              <div className="py-16 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-[#F7C9D5]/40 flex items-center justify-center text-[#9D3158] mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#301B25]">Message Received</h3>
                <p className="text-xs text-[#301B25]/75 max-w-sm mx-auto">
                  Thank you for contacting THREADTALES. Our concierge will respond to your email within 24 business hours.
                </p>
                <button
                  onClick={() => setSubmittedGeneral(false)}
                  className="px-6 py-2.5 bg-[#9D3158] text-[#FFFDFB] text-xs font-semibold rounded-full uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleGeneralSubmit} className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-[#301B25]">Send an Atelier Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">Your Name</label>
                    <input
                      type="text"
                      required
                      value={generalData.name}
                      onChange={(e) => setGeneralData({ ...generalData, name: e.target.value })}
                      placeholder="Sophia Laurent"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-medium text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={generalData.email}
                      onChange={(e) => setGeneralData({ ...generalData, email: e.target.value })}
                      placeholder="sophia@example.com"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-medium text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">Inquiry Subject</label>
                  <CustomSelect
                    options={subjectOptions}
                    value={generalData.subject}
                    onChange={(val) => setGeneralData({ ...generalData, subject: val })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">Message</label>
                  <textarea
                    required
                    rows="5"
                    value={generalData.message}
                    onChange={(e) => setGeneralData({ ...generalData, message: e.target.value })}
                    placeholder="How can our atelier assist you today?"
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-medium text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingGeneral}
                  className="w-full py-4 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg shadow-[#9D3158]/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {loadingGeneral ? (
                    <span>SAVING TO DATABASE...</span>
                  ) : (
                    <>
                      <span>SEND INQUIRY TO DATABASE</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Dedicated Custom Product Request Page / Section */}
      {activeTab === 'custom' && (
        <div className="space-y-16 animate-in fade-in duration-300 relative z-10">
          
          {/* Custom Banner Intro */}
          <div className="bg-[#FFF7F9] p-8 sm:p-10 rounded-3xl border border-[#F7C9D5] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#9D3158] uppercase bg-white px-3 py-1 rounded-full border border-[#F7C9D5] inline-block">
                1-OF-1 BESPOKE COMMISSIONS
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#301B25]">
                Commission a Custom Crochet Creation
              </h2>
              <p className="text-xs sm:text-sm text-[#301B25]/80 leading-relaxed font-normal">
                Want a personalized bouquet arrangement, custom yarn color combination, embroidered initials on keychains, or bulk wedding gift favors? Tell us your vision below.
              </p>
            </div>

            <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-[#F7C9D5]/80 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-[#9D3158] font-bold">
                <Wand2 className="w-4 h-4" />
                <span>Custom Order Guarantee</span>
              </div>
              <p className="text-[#301B25]/75 leading-relaxed text-[11px]">
                Hand-looped to your exact specifications. High-resolution preview photos sent before shipping.
              </p>
            </div>
          </div>

          {/* Custom Request Form & Guidance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Custom Request Form */}
            <div className="lg:col-span-8 bg-[#FFFDFB] p-8 sm:p-10 rounded-3xl border border-[#F7C9D5]/60 shadow-sm">
              {submittedCustom ? (
                <div className="py-16 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#F7C9D5]/40 flex items-center justify-center text-[#9D3158] mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#301B25]">Custom Order Request Submitted!</h3>
                  <p className="text-xs text-[#301B25]/75 max-w-sm mx-auto">
                    Thank you! Our master artisan will review your custom specifications and reply with yarn swatches and exact pricing within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmittedCustom(false)}
                    className="px-6 py-2.5 bg-[#9D3158] text-[#FFFDFB] text-xs font-semibold rounded-full uppercase tracking-wider"
                  >
                    Submit Another Custom Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#F7C9D5]/50 pb-4">
                    <h3 className="font-serif text-2xl font-bold text-[#301B25]">Bespoke Order Specification</h3>
                    <span className="text-xs font-semibold text-[#9D3158]">Step 1 of 1</span>
                  </div>

                  {/* Personal Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={customData.name}
                        onChange={(e) => setCustomData({ ...customData, name: e.target.value })}
                        placeholder="Elena Rostova"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-medium text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">Email Address</label>
                      <input
                        type="email"
                        required
                        value={customData.email}
                        onChange={(e) => setCustomData({ ...customData, email: e.target.value })}
                        placeholder="elena@example.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-medium text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                      />
                    </div>
                  </div>

                  {/* Custom Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">Product Category</label>
                      <CustomSelect
                        options={productCategoryOptions}
                        value={customData.productType}
                        onChange={(val) => setCustomData({ ...customData, productType: val })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">Preferred Yarn Color Palette</label>
                      <CustomSelect
                        options={colorPaletteOptions}
                        value={customData.colorPalette}
                        onChange={(val) => setCustomData({ ...customData, colorPalette: val })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">Required Event / Delivery Date</label>
                      <input
                        type="date"
                        value={customData.targetDate}
                        onChange={(e) => setCustomData({ ...customData, targetDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-medium text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">Quantity Needed</label>
                      <input
                        type="number"
                        min="1"
                        value={customData.quantity}
                        onChange={(e) => setCustomData({ ...customData, quantity: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-medium text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#301B25]">Customization Details & Special Requests</label>
                    <textarea
                      required
                      rows="5"
                      value={customData.customNotes}
                      onChange={(e) => setCustomData({ ...customData, customNotes: e.target.value })}
                      placeholder="Describe your desired design, custom initials, flower types, handle styles, or specific color details..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFF7F9] border border-[#F7C9D5] text-xs font-medium text-[#301B25] focus:outline-none focus:ring-2 focus:ring-[#9D3158]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingCustom}
                    className="w-full py-4 bg-[#9D3158] hover:bg-[#70213F] text-[#FFFDFB] font-semibold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg shadow-[#9D3158]/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                  >
                    {loadingCustom ? (
                      <span>SAVING TO DATABASE...</span>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>SUBMIT BESPOKE REQUEST TO DATABASE</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Custom Order Guidance Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FFFDFB] p-6 rounded-3xl border border-[#F7C9D5]/60 shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-lg text-[#301B25]">Custom Order Workflow</h4>
                
                <div className="space-y-3 text-xs text-[#301B25]/80">
                  <div className="flex space-x-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#9D3158] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <p><strong>Submit Request:</strong> Fill in your desired product type, yarn colors, and event date.</p>
                  </div>
                  <div className="flex space-x-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#9D3158] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <p><strong>Artisan Review:</strong> We reply within 24 hours with yarn swatch photos & exact quote.</p>
                  </div>
                  <div className="flex space-x-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#9D3158] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <p><strong>Hand-Looping:</strong> Our artisan handcrafts your item with daily progress updates.</p>
                  </div>
                  <div className="flex space-x-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#9D3158] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</div>
                    <p><strong>Photo Approval:</strong> Final preview photos sent before luxury packaging & dispatch.</p>
                  </div>
                </div>
              </div>

              {/* Sample Custom Showcase Card */}
              <div className="bg-[#FFF7F9] p-6 rounded-3xl border border-[#F7C9D5] space-y-3 text-center">
                <Palette className="w-8 h-8 text-[#9D3158] mx-auto opacity-80" />
                <h5 className="font-serif font-bold text-base text-[#301B25]">Need Inspiration?</h5>
                <p className="text-xs text-[#301B25]/70">
                  Check our existing 35 products for colorways and stitch patterns you can customize.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Interactive Custom Order FAQ Accordions */}
      <div className="bg-[#FFFDFB] p-8 sm:p-12 rounded-3xl border border-[#F7C9D5]/60 shadow-sm space-y-8 relative z-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#9D3158] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>FREQUENCY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#301B25]">
            Custom Orders & Concierge FAQ
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-[#FFF7F9] rounded-2xl border border-[#F7C9D5]/70 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-serif font-bold text-base text-[#301B25] hover:text-[#9D3158] flex items-center justify-between transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#9D3158]" /> : <ChevronDown className="w-5 h-5 text-[#301B25]/50" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#301B25]/80 leading-relaxed border-t border-[#F7C9D5]/40 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
