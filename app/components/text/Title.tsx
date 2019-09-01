import React from 'react'
import Icon from '../elements/Icon'
import colors from '../../theme/colors'

type Props = {
  icon?: string
  headerType?: 'h1' | 'h2'
} & import('react').HTMLAttributes<HTMLHeadElement>

const Title = ({ children, style, icon, headerType, ...props }: Props) => {
  const HeaderComponent = headerType || 'h1'

  return (
    <div className={'title-container'}>
      {icon && (
        <span className={'icon'}>
          <Icon name={icon} size={'1em'} />
        </span>
      )}
      
      <HeaderComponent className={'title'} {...props}>
        {children}
      </HeaderComponent>

      <style jsx>{`
        .title {
          color: ${colors.veryDarkGray};
        }
      `}</style>

      <style jsx>{`
        .icon {
          margin-right: .5em;
        }

        .title-container {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .title {
          margin: 10px 0;
          font-weight: 600;
          flex: 1;
          display: block;
        }

        h1 {
          font-size: 1.8em;
        }

        h2 {
          margin: 5px 0;
          line-height: 1.75em;
          font-size: 1.2em;
        }

        @media (min-width: 768px) {
          h1 {
            font-size: 2em;
          }

          h2 {
            margin: 5px 0;
            line-height: 1.75em;
            font-size: 1.5em;
          }
        }
      `}</style>
    </div>
  )
}

Title.defaultProps = {
  type: 'h2'
}

export default Title
