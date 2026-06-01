import * as React from 'react'
import { cn } from '~/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-2xl border border-gray-100 bg-white shadow-sm', className)} {...props} />
  )
)
Card.displayName = 'Card'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center border-t border-gray-100 px-6 py-4', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardContent, CardFooter }
