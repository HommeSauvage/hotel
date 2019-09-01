import colors from '../../theme/colors'

type Props = {
  children?: import('react').ReactNode
}
const Error = ({ children }: Props) => (
  <div>
    {children}
    <style jsx>{`
      {
        color: ${colors.danger};
      }
    `}</style>
  </div>
)

export default Error
