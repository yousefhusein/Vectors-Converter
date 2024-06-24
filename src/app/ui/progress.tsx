import React from 'react'
import { cn } from '@/lib/utils'

interface PropsType extends React.HTMLAttributes<HTMLDivElement> {
  percent: number
}

export default function Progress({ className, percent, ...props }: PropsType) {
  return (
    <div className="w-full bg-gray-300">
      <div
        className={
        cn(
          `min-h-2 bg-indigo-800`,
          className,
        )
      }
        style={{ width: `${percent}%` }}
        {...props}
      >
      </div>
    </div>
  )
}
