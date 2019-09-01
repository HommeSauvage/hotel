import Error from './Error'

type Props = {
  list: Array<string> | undefined
}

const ErrorList = ({ list }: Props) => list ? (
  <Error>
    <div>{list.map((error) => error)}</div>
  </Error>
) : null

export default ErrorList
