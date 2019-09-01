import { forwardRef } from 'react'
import classnames from 'classnames'
import { resolve } from 'styled-jsx/css'
import BaseButton from './BaseButton'
import colors from '../../../theme/colors'

const buttonStyles = resolve`
  .button {
    background: ${colors.primary};
    color: ${colors.white};
    border-radius: .2rem;
    padding: .5em .7em;
    font-size: 1rem;
    transition: all 0.1s ease-in-out;
    border: solid 1px ${colors.primary};
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    text-transform: uppercase;
  }

  .button.normal-case {
    text-transform: none;
  }

  .button:hover {
    background: ${colors.accent};
    border-color: ${colors.accent};
  }

  .button:disabled, button.disabled {
    background: ${colors.lightGray};
    border-color: ${colors.lightGray};
    color: ${colors.white};
    cursor: default;
  }
`

export type Props = {
  normalCase?: boolean
} & import('./BaseButton').Props

const DefaultButton = ({ className, normalCase, ...props }: Props, ref: import('react').Ref<any>) => (
  <>
    <BaseButton ref={ref} className={classnames([
      buttonStyles.className,
      className,
      { 'normal-case': normalCase }
    ])} {...props} />
    {buttonStyles.styles}
  </>
)

export default forwardRef(DefaultButton)
