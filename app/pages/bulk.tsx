import { NextPage } from 'next'
import fetch from '@stillthere/fetch'
import BulkUpdate from '../components/BulkUpdate'
import Page from '../components/layout/Page'
import Container from '../components/layout/Container'
import config from '../config'

type Props = {
  rooms?: Array<import('@hotel/models/types').IRoom>,
}

const Bulk: NextPage<Props>  = ({ rooms }: Props) => {
  return (
    <Page title={'Bulk Update'}>
      <Container narrow>
        <BulkUpdate preloadedRooms={rooms} />
      </Container>
    </Page>
  )
}

Bulk.getInitialProps = async ({ req }) => {
  try {
    // Only when hitting the server, otherwise, let the 
    // component fetch
    if(req) {
      // TODO: validation for around
      const { payload: rooms } = await fetch(`${config.apiUrl}/rooms`)
      return { rooms }
    }  
  } catch (e) {
    console.error('error', e)
    // We're returning {} anyway later
  }
  

  return {}
}

export default Bulk
