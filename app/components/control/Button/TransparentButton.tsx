import { forwardRef } from 'react'
import classnames from 'classnames'
import { resolve } from 'styled-jsx/css'
import DefaultButton from './DefaultButton'
import colors from '../../../theme/colors'

const buttonStyles = resolve`
  .button {
    background: ${colors.transparent};
    border-color: ${colors.transparent};
    color: ${colors.primary};
  }

  .button:hover {
    background: ${colors.transparent};
    border-color: ${colors.transparent};
  }

  .button.no-padding {
    padding: 0;
  }

  .button:disabled, button.disabled {
    background: ${colors.transparent};
    border-color: ${colors.transparent};
    color: ${colors.gray};
  }
`

type Props = {
  noPadding?: boolean
} & import('./DefaultButton').Props

const TransparentButton = ({ className, noPadding, ...props }: Props, ref: import('react').Ref<any>) => (
  <>
    <DefaultButton ref={ref} className={classnames([
      buttonStyles.className,
      { 'no-padding': noPadding },
      className
    ])} {...props} hasOpacity />
    {buttonStyles.styles}
  </>
)

export default forwardRef(TransparentButton)