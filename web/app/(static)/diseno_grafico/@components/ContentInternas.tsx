import React from 'react'

export const ContentInternas = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={`max-w-[1450px] mx-auto w-full px-4 md:px-6 lg:px-8 ${className || ''}`}>
      {children}
    </div>
  )
}
