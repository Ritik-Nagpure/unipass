import { useNavigate } from '@tanstack/react-router'
import { LuArrowLeft } from 'react-icons/lu'

const TermsPage = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full h-full bg-[#1A1A24] pb-10">
      <div className="h-full flex flex-col bg-[#232330] rounded-2xl shadow-2xl sm:m-8">

        {/* Header with back button */}
        <div className="flex items-center gap-4 px-6 sm:px-10 py-6 border-b border-gray-700">
          <button
            onClick={() => navigate({ to: '/auth' })}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <LuArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-xl font-semibold text-white">Terms & Conditions</h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 px-6 sm:px-10 py-8">
          <div className="max-w-3xl mx-auto text-gray-300 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or using our service, you agree to be bound by these Terms
                and Conditions. If you do not agree with any part of these terms, you
                must not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">2. Use of Service</h2>
              <p>
                You agree to use the service only for lawful purposes and in a way that
                does not infringe the rights of, restrict, or inhibit anyone else's use
                and enjoyment of the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">3. Account Responsibility</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activities that occur under your account. Notify
                us immediately of any unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">4. Privacy</h2>
              <p>
                Your use of the service is also governed by our Privacy Policy. Please
                review it to understand how we collect, use, and protect your personal
                information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">5. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the service
                at any time, without notice, for conduct that we believe violates these
                Terms or is harmful to other users or us.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">6. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. Continued use of the service
                after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-2">7. Contact</h2>
              <p>
                For any questions regarding these Terms, please contact us at
                support@example.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage