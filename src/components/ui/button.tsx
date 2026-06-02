import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 border-2',
  {
    variants: {
      variant: {
        default: 'bg-black text-white border-black hover:bg-black/80',
        outline: 'border-black text-black bg-white hover:bg-gray-100',
        ghost: 'border-transparent text-black hover:bg-gray-100 hover:border-gray-200',
        link: 'border-transparent text-black underline-offset-4 hover:underline',
        destructive: 'bg-red-500 text-white border-red-500 hover:bg-red-600',
      },
      size: {
        default: 'h-9 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
