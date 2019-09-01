import { useState, forwardRef } from 'react'
import classnames from 'classnames'
import Icon from '../elements/Icon'
import colors from '../../theme/colors'

type InputChangeEvent = import('react').ChangeEvent<HTMLInputElement>
type InputKeyboardEvent = import('react').KeyboardEvent<HTMLInputElement>
type FocusEvent = import('react').FocusEvent

export type Props = {
  onChangeText?: (value: string) => void
  onChange?: (event: InputChangeEvent) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onEnter?: (event: InputKeyboardEvent) => void
  onKeyUp?: (event: InputKeyboardEvent) => void
  className?: string
  icon?: string
  disabled?: boolean
  label?: string
  style?: any
} & import('react').HTMLProps<HTMLInputElement>

const Input = ({ onChangeText, onChange, onFocus, onBlur, className, icon, disabled, label, style, onEnter, onKeyUp, ...props }: Props, ref?: import('react').Ref<any>) => {
  const [isFocused, setisFocused] = useState(false)

  const handleFocus = (e: FocusEvent) => {
    setisFocused(true)
    if(onFocus) {
      onFocus(e)
    }
  }

  const handleBlur = (e: FocusEvent) => {
    setisFocused(false)
    if(onBlur) {
      onBlur(e)
    }
  }

  const handleKeyUp = (event: InputKeyboardEvent) => {
    if(onKeyUp) { 
      onKeyUp(event)
    }
    
    if(event.key === 'Enter' && onEnter) {
      onEnter(event)
    } 
  }

  const handleChange = (event: InputChangeEvent) => {
    if(onChangeText) {
      onChangeText(event.target.value)
    }
    
    if(onChange) {
      onChange(event)
    }
  }

  return (
    <label
      ref={ref}
      style={style} 
      className={classnames([
        className,
        { focus: isFocused },
        { disabled }
      ])}>

      {label && (
        <span className={'label-name'}>{label}</span>
      )}
      
      {icon && (
        <span className={'icon'}>
          <Icon name={icon} style={{ fontSize: '.8em' }} />
        </span>
      )}
      
      <div>
        <input 
          disabled={disabled} 
          onFocus={handleFocus} 
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props} />
      </div>
      <style jsx>{`
        label.disabled {
          background: ${colors.disabled};
          color: ${colors.borderGray};
        }

        label.focus {
          transition: all 100ms ease-in 0s;
          border-color: ${colors.black};
          background: ${colors.white};
        }

        label {
          background: none;
          display: flex;
          align-items: center;
          width: 100%;
          border-radius: 5px;
          border: 1px solid ${colors.borderGray};
          color: ${colors.black};
          background-color: ${colors.white};
        }

        .label-name {
          color: ${colors.borderGray};
        }

        label.focus .label-name {
          color: ${colors.darkGray};
        }

        span {
          margin-left: .9rem;
        }

        div {
          position: relative;
          width: 100%;
          height: 37px;
          line-height: 37px;
          margin: 0px auto;
          margin-left: .9rem;
        }

        input {
          background-color: transparent;
          box-sizing: border-box;
          display: block;
          text-align: left;
          font-size: 1em;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
          height: 37px;
          line-height: 2em;
          width: 100%;
          box-shadow: none;
          border-width: initial;
          border-style: none;
          border-color: initial;
          border-image: initial;
          border-radius: 0px;
          padding: 4px 0px;
          margin: 0px auto;
        }
      `}</style>
    </label>
  )
}

export default forwardRef(Input)
