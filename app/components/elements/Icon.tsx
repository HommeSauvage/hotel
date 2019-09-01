import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHashtag,
  faCheck,
  faTimes,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faHashtag,
  faCheck,
  faTimes,
  faCaretDown,
)

export type Props = {
  name: import('@fortawesome/fontawesome-common-types').IconPathData
  size?: number | string
  color?: string
  style?: any
}

interface SpanStypes {
  fontSize?: string
}

const Icon = ({ name, size, color, ...props}: Props) => {
  // FontAwesomeIcon doesn't accept a number for size, so
  // we take that into a span above it
  const spanStyles: SpanStypes = {}
  if(typeof size === 'number') {
    spanStyles.fontSize = `${size}px`
  } else if (typeof size === 'string' && (size.indexOf('em') !== -1 || size.indexOf('px') !== -1)) {
    // The if above should rather filter size values from 
    spanStyles.fontSize = size
  }
  
  // Had to do this to ignore some TS stuff
  // @ts-ignore
  const iconRendered = <FontAwesomeIcon fixedWidth icon={name} size={spanStyles.fontSize ? null : size} color={color} />
  
  return (
    <span style={spanStyles} {...props}>
      {iconRendered}
    </span>
  )
}

export default Icon
