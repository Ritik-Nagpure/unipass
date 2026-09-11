import { useNavigate } from '@tanstack/react-router'
import { LuArrowLeft } from 'react-icons/lu'

const AboutPage = () => {
  const navigate = useNavigate()

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
          <h1 className="text-xl font-semibold text-white">About Us</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 sm:px-10 py-8">
          <div className="max-w-3xl mx-auto text-gray-300 space-y-8 leading-relaxed">

            <section>
              <h2 className="text-3xl font-semibold text-white mb-4">Our Mission</h2>
              <p>
                We're building a simpler, safer way to manage digital identity. In a
                world where every service asks for credentials, we believe your data
                should stay yours — protected, portable, and under your control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">What We Do</h2>
              <p className="mb-4">
                Our platform brings together secure authentication, password management,
                and multi-factor verification into one seamless experience.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>Passwordless and password-based login</li>
                <li>Multi-factor authentication across devices</li>
                <li>Granular access controls for teams and individuals</li>
                <li>End-to-end encrypted credential storage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Our Values</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#2D2D3A]">
                  <h3 className="text-white font-medium mb-1">Privacy First</h3>
                  <p className="text-sm text-gray-400">
                    We never sell your data, and we design with privacy as the default.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#2D2D3A]">
                  <h3 className="text-white font-medium mb-1">Transparency</h3>
                  <p className="text-sm text-gray-400">
                    Open about how we work, what we collect, and where we're headed.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#2D2D3A]">
                  <h3 className="text-white font-medium mb-1">Reliability</h3>
                  <p className="text-sm text-gray-400">
                    Security you can count on, with uptime you can plan around.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#2D2D3A]">
                  <h3 className="text-white font-medium mb-1">Craft</h3>
                  <p className="text-sm text-gray-400">
                    We sweat the details — because auth is too important to get wrong.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">Get in Touch</h2>
              <p>
                Want to learn more, partner with us, or just say hi? Reach out at{' '}
                <a href="mailto:hello@example.com" className="text-[#7C5CFC] hover:underline">
                  hello@example.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage