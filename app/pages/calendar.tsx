import { NextPage } from 'next'
import { useRouter } from 'next/router'
import fetch from '@stillthere/fetch'
import Page from '../components/layout/Page'
import Calendar, { Props as CalendarProps} from '../components/Calendar'
import config from '../config'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import Container from '../components/layout/Container'

type Props = {
  rooms?: keyof CalendarProps['preloadedRooms'],
}

const CalendarPage: NextPage<Props>  = ({ rooms }: Props) => {
  const { query } = useRouter()
  const around = query.around ? new Date(`${query.around}`) : new Date()

  return (
    <Page title={'Calendar'}>
      <Container>
        <Calendar 
          preloadedRooms={rooms} 
          preloadedAround={around} />
      </Container>
    </Page>
  )
}

CalendarPage.getInitialProps = async ({ req, query }) => {
  try {
    // Only when hitting the server, otherwise, let the 
    // component fetch
    if(req) {
      // TODO: validation for around
      const around = query.around ? new Date(`${query.around}`) : new Date()
      const q = require('querystring').encode({
        calendar: 'true', // query string
        from: startOfMonth(around).toISOString(),
        to: endOfMonth(around).toISOString()
      })

      const { payload: rooms } = await fetch(`${config.apiUrl}/rooms?${q}`)

      return { rooms }
    }  
  } catch (e) {
    console.error('error', e)
    // We're returning {} anyway later
  }
  

  return {}
}

export default CalendarPage
