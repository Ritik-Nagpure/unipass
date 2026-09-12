import { useState } from 'react'
import {
  LuShieldCheck,
  LuSmartphone,
  LuKeyRound,
  LuFingerprint,
  LuMail,
  LuCheck,
  LuChevronRight,
  LuTriangleAlert,
  LuLoader,
} from 'react-icons/lu'
import Modal from '../../shared/components/modal'

const MfaPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="h-full w-full bg-[#1A1A24] overflow-y-auto no-scrollbar">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-10">

          {/* ---------- HERO ---------- */}
          <section className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 mb-4">
              <LuShieldCheck className="text-[#7C5CFC]" size={14} />
              <span className="text-xs text-[#7C5CFC] font-medium">
                Security Feature
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-3">
              Multi-Factor Authentication
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
              Add an extra layer of security to your account. Even if your password
              is compromised, MFA keeps attackers out.
            </p>
          </section>

          {/* ---------- WHAT IS IT ---------- */}
          <section className="bg-[#232330] border border-gray-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
              What is Multi-Factor Authentication?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6">
              MFA requires two or more verification methods before granting access.
              Instead of relying on a password alone, you also prove your identity
              using something you <span className="text-white">have</span> (like your
              phone) or something you <span className="text-white">are</span> (like
              your fingerprint).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: LuKeyRound,
                  title: 'Something you know',
                  desc: 'Your password or PIN',
                },
                {
                  icon: LuSmartphone,
                  title: 'Something you have',
                  desc: 'Phone, authenticator app, or hardware key',
                },
                {
                  icon: LuFingerprint,
                  title: 'Something you are',
                  desc: 'Fingerprint, Face ID, or other biometrics',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="p-4 bg-[#2D2D3A] rounded-lg border border-gray-700/50"
                >
                  <div className="w-9 h-9 rounded-md bg-[#7C5CFC]/15 flex items-center justify-center mb-3">
                    <Icon className="text-[#7C5CFC]" size={18} />
                  </div>
                  <p className="text-white text-sm font-medium mb-1">{title}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- WHY USE IT ---------- */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Why should you enable it?
            </h2>
            <ul className="space-y-3">
              {[
                'Blocks 99.9% of automated account takeover attacks',
                'Protects you even if your password is leaked',
                'Required by most enterprise security standards',
                'Takes less than 2 minutes to set up',
              ].map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-3 p-4 bg-[#232330] border border-gray-800 rounded-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <LuCheck className="text-emerald-400" size={14} />
                  </div>
                  <span className="text-sm text-gray-300">{reason}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------- METHODS ---------- */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Available methods
            </h2>
            <div className="space-y-3">
              {[
                {
                  icon: LuSmartphone,
                  title: 'Authenticator App',
                  desc: 'Use Google Authenticator, Authy, or 1Password to generate time-based codes.',
                  recommended: true,
                },
                {
                  icon: LuMail,
                  title: 'Email Verification',
                  desc: 'Receive a one-time code to your registered email address.',
                  recommended: false,
                },
                {
                  icon: LuKeyRound,
                  title: 'Hardware Security Key',
                  desc: 'Use a physical USB/NFC key like YubiKey for the strongest protection.',
                  recommended: false,
                },
              ].map(({ icon: Icon, title, desc, recommended }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-4 bg-[#232330] border border-gray-800 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#7C5CFC]/15 flex items-center justify-center shrink-0">
                    <Icon className="text-[#7C5CFC]" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-medium text-sm">{title}</p>
                      {recommended && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- WARNING ---------- */}
          <section className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <LuTriangleAlert className="text-amber-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-amber-200 font-medium text-sm mb-1">
                  Save your backup codes
                </h3>
                <p className="text-xs text-amber-200/70">
                  Once enabled, you'll receive one-time backup codes. Store them
                  somewhere safe — they're the only way to regain access if you lose
                  your device.
                </p>
              </div>
            </div>
          </section>

          {/* ---------- CTA ---------- */}
          <section className="bg-linear-to-br from-[#7C5CFC]/20 to-[#7C5CFC]/5 border border-[#7C5CFC]/30 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  Ready to secure your account?
                </h3>
                <p className="text-sm text-gray-300">
                  Enable MFA in just a couple of minutes.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#7C5CFC] hover:bg-[#6B4EE6] text-white font-medium rounded-lg transition-colors shrink-0 self-start sm:self-auto"
              >
                Enable MFA
                <LuChevronRight size={16} />
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* ---------- MODAL ---------- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Coming Soon"
      >
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-14 h-14 rounded-full bg-[#7C5CFC]/15 flex items-center justify-center mb-4">
            <LuLoader className="text-[#7C5CFC] animate-spin" size={26} />
          </div>

          <h4 className="text-white font-semibold text-lg mb-2">
            Feature in Development
          </h4>
          <p className="text-sm text-gray-400 mb-6 max-w-sm">
            Multi-Factor Authentication is currently being built. It will be
            available in an upcoming release — stay tuned!
          </p>

          <button
            onClick={() => setIsModalOpen(false)}
            className="w-full py-3 bg-[#7C5CFC] hover:bg-[#6B4EE6] text-white font-medium rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </Modal>
    </>
  )
}

export default MfaPage