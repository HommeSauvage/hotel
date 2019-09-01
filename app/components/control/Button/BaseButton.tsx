import { forwardRef } from 'react'
import classnames from 'classnames'

export type Props = {
  a?: boolean
  hasOpacity?: boolean
  disabled?: boolean
} & import('react').HTMLAttributes<HTMLAnchorElement | HTMLButtonElement>

const BaseButton = ({ onClick, className, style, children, disabled, a, hasOpacity, ...props }: Props, ref: import('react').Ref<any>) => {

  const Component = a ? 'a' : 'button'

  const handleOnClick = (e: import('react').MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if(disabled) {
      return
    }
    
    if(onClick) {
      onClick(e)
    }
  }

  return (
    <Component
      ref={ref}
      disabled={disabled}
      onClick={handleOnClick}
      style={style}
      className={classnames([
        'button',
        { 'has-opacity': hasOpacity }, 
        className
      ])}
      {...props}>
      {children}
      <style jsx>{`
        .button {
          outline: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin: 0;
          display: flex;
          font-size: 1rem;
          text-decoration: none;
          transition: .1s all ease-in-out;
          display: flex;
          flex-direction: column;
        }

        .button:focus, .button:hover {
          outline: none;
          text-decoration: none;
        }

        .button.has-opacity:hover, .button.has-opacity:focus {
          opacity: .7;
        }

        .button:disabled:hover, .button:disabled:focus, {
          cursor: default;
          opacity: 1;
        }

      `}</style>
    </Component>
  )
};

export default forwardRef(BaseButton)
