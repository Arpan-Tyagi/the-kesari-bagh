'use client';

// Private Celebrations, Weddings & Corporate Inquiries Form
import { useState } from 'react';
import { submitEventInquiryAction } from '@/actions/booking-actions';
import { Send, CheckCircle2, Sparkles } from 'lucide-react';

export function EventsInquirySection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'intimate_wedding',
    guestCount: 20,
    preferredDate: '',
    message: '',
  });

  const [status, setStatus] = useState<{
    submitting: boolean;
    success: boolean;
    message: string;
  }>({
    submitting: false,
    success: false,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, message: '' });

    const res = await submitEventInquiryAction({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      eventType: formData.eventType,
      guestCount: Number(formData.guestCount),
      preferredDate: formData.preferredDate,
      message: formData.message,
    });

    if (res.success) {
      setStatus({ submitting: false, success: true, message: res.message });
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: 'intimate_wedding',
        guestCount: 20,
        preferredDate: '',
        message: '',
      });
    } else {
      setStatus({ submitting: false, success: false, message: res.message || 'Error submitting inquiry' });
    }
  };

  return (
    <section id="events" className="py-28 px-6 bg-[#142019] text-[#FBF9F5] relative">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Gatherings</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light">
            Host at The Kesari Bagh
          </h2>
          <p className="text-xs sm:text-sm text-[#FBF9F5]/70 font-light leading-relaxed">
            From intimate weddings and brand video shoots to bespoke leadership offsites. We accommodate up to 50 daytime event guests across 1.25 acres.
          </p>
        </div>

        <div className="double-bezel">
          <div className="double-bezel-inner p-6 sm:p-10 bg-[#FBF9F5] text-[#2B2D2B]">
            {status.success ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#142019] mx-auto" />
                <h3 className="font-serif text-2xl text-[#142019]">Inquiry Gratefully Received</h3>
                <p className="text-sm text-[#5F635F] max-w-md mx-auto">{status.message}</p>
                <button
                  onClick={() => setStatus({ submitting: false, success: false, message: '' })}
                  className="rounded-full bg-[#142019] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Radhika Mehra"
                      className="w-full rounded-lg border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="radhika@example.com"
                      className="w-full rounded-lg border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98111 22334"
                      className="w-full rounded-lg border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
                      Occasion Type
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full rounded-lg border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
                    >
                      <option value="intimate_wedding">Intimate Wedding</option>
                      <option value="corporate_retreat">Corporate Offsite</option>
                      <option value="celebration">Private Celebration / Birthday</option>
                      <option value="video_shoot">Editorial / Film Shoot</option>
                      <option value="farm_picnic">Garden Farm Gathering</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
                      Estimated Guests
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      required
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                      className="w-full rounded-lg border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full rounded-lg border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
                    Vision &amp; Specific Requirements
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about catering desires, sound preferences, photography needs..."
                    className="w-full rounded-lg border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
                  />
                </div>

                {status.message && !status.success && (
                  <p className="text-xs text-red-600 font-medium">{status.message}</p>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={status.submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-[#142019] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5] transition-all hover:bg-[#23342A] disabled:opacity-50"
                  >
                    <span>{status.submitting ? 'Submitting...' : 'Dispatch Event Inquiry'}</span>
                    <Send className="w-3.5 h-3.5 text-[#C5A880]" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
