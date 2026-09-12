import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { LuX } from 'react-icons/lu'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  maxWidth?: string
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = 'max-w-md',
}: ModalProps) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)

    // Prevent background scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const portalTarget = document.getElementById('modal-div')
  if (!portalTarget) return null

  return createPortal(
    <div
      className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} bg-[#232330] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <LuX size={18} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>,
    portalTarget,
  )
}

export default Modal