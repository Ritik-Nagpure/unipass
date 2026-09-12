import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const paddingMap = {
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
}

const Card = ({ children, className = '', padding = 'md' }: CardProps) => {
  return (
    <div
      className={`bg-[#232330] border border-gray-800 rounded-2xl ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card