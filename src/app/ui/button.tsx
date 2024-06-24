import React from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface PropsType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string
}

export default function Button({ children, className, icon, ...props }: PropsType) {
  return (
    <button
      type="button"
      className={
        cn(
          `px-5 py-2 rounded-lg shadow-none border-0 font-semibold flex items-center transition`,
          'transition-transform active:scale-95',
          className,
        )
      }
      {...props}
    >
      <span>{children}</span>
      {icon ? <Icon icon={icon} fontSize={18} className="ms-1" /> : ''}
    </button>
  )
}
