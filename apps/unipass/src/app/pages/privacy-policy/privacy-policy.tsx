import { useNavigate } from '@tanstack/react-router'
import { LuArrowLeft } from 'react-icons/lu'

const PrivacyPolicyPage = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-[#1A1A24]">
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
          <h1 className="text-xl font-semibold text-white">Privacy Policy</h1>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 sm:px-10 py-8">
          <div className="max-w-3xl mx-auto text-gray-300 space-y-6 leading-relaxed">
            <p className="text-sm text-gray-500">Last updated: January 2026</p>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as your name,
                email address, and password when you create an account. We also collect
                usage data automatically, including your IP address, browser type, and
                pages visited.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our
                services, to communicate with you, and to protect our users. We do not
                sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">3. Cookies & Tracking</h2>
              <p>
                We use cookies and similar technologies to keep you logged in, remember
                your preferences, and analyze how our service is used. You can control
                cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">4. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data,
                including encryption in transit and at rest. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">5. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal data at
                any time. You may also request a copy of the data we hold about you by
                contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">6. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you
                of any significant changes by email or through the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">7. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at
                privacy@example.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage