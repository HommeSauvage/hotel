import Link from 'next/link'
import Container from './Container'
import colors from '../../theme/colors'

const Menu = () => (
  <div className={'root'}>
    <Container>
      <nav>
        <Link href={'/calendar'}><a>Calendar</a></Link>
        <Link href={'/bulk'}><a>Bulk Update</a></Link>
      </nav>
    </Container>
    <style jsx>{`
      nav {
        display: flex;
        justify-content: center;
      }
      .root {
        margin-bottom: 1em;
        border-bottom: 1px solid ${colors.separator};
        padding: 1em 0;
      }

      a {
        display: inline-block;
        font-size: 1.2em;
      }

      a:first-child {
        margin-right: 1em;
      }
    `}</style>
  </div>
)

export default Menu
