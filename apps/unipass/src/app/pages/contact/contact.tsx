import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { LuArrowLeft, LuMail, LuMapPin, LuPhone } from 'react-icons/lu'

const ContactPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to your API
    setSubmitted(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="h-screen w-screen bg-[#1A1A24] overflow-hidden">
      <div className="w-full h-full max-w-350 max-h-255 mx-auto my-auto flex flex-col bg-[#232330] rounded-2xl shadow-2xl m-4 sm:m-8">

        {/* Header */}
        <div className="flex items-center gap-4 px-6 sm:px-10 py-6 border-b border-gray-700">
          <button
            onClick={() => navigate({ to: '/auth' })}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <LuArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-xl font-semibold text-white">Contact Us</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 sm:px-10 py-8">
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10">

            {/* Left — Info */}
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">Let's talk</h2>
                <p className="text-gray-400 leading-relaxed">
                  Have a question, feedback, or need support? We'd love to hear from
                  you. Our team typically responds within 24 hours.
                </p>
              </section>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <LuMail className="text-[#7C5CFC] mt-1 shrink-0" size={20} />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <a
                      href="mailto:support@example.com"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      support@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <LuPhone className="text-[#7C5CFC] mt-1 shrink-0" size={20} />
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <a
                      href="tel:+1234567890"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <LuMapPin className="text-[#7C5CFC] mt-1 shrink-0" size={20} />
                  <div>
                    <p className="text-white font-medium">Office</p>
                    <p className="text-sm text-gray-400">
                      123 Innovation Drive<br />
                      San Francisco, CA 94103
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              {submitted ? (
                <div className="p-6 rounded-lg bg-[#2D2D3A] border border-[#7C5CFC]/40 text-center">
                  <h3 className="text-white text-lg font-semibold mb-2">Message sent!</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-[#7C5CFC] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#2D2D3A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#7C5CFC] transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#2D2D3A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#7C5CFC] transition-colors"
                  />
                  <textarea
                    placeholder="Your message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#2D2D3A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#7C5CFC] transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#7C5CFC] hover:bg-[#6B4EE6] text-white font-medium rounded-lg transition-colors"
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage