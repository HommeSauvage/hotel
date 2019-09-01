import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import fetch from '@stillthere/fetch'
import { useRouter } from 'next/router'
import Title from '../text/Title'
import ErrorList from '../text/ErrorList'
import Select from '../control/Select'
import Button from '../control/Button'
import DatesSelector from '../control/DatesSelector'
import Input from '../control/Input'
import config from '../../config'
import { parseErrors } from '../../utils/errors'

type Errors = import('../../utils/errors').Errors
type IRoom = import('@hotel/models/types').IRoom

export type Props = {
  preloadedRooms?: Array<IRoom>
}

interface OptionType {
  label: string
  value: string
}

const formatRoomOptions = (rooms: Array<IRoom>): Array<OptionType> => {
  return rooms.map((room: IRoom): OptionType => ({
    label: room.name,
    value: room._id
  }))
}

const BulkUpdate = ({ preloadedRooms }: Props) => {
  /* State ------------------------------------------------------------- */
  const router = useRouter()
  const [rooms, setRooms] = useState<Array<IRoom>>(preloadedRooms || [])
  const formattedRooms = formatRoomOptions(rooms)
  const [selectedRoom, setSelectedRoom] = useState<OptionType | undefined>()
  const [dates, setDates] = useState<Array<Date>>([])
  const [price, setPrice] = useState<number>()
  const [availability, setAvailability] = useState<number>()
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [errors, setErrors] = useState<Errors>({})

  /* Handlers --------------------------------------------------------- */
  const save = async () => {
    try {
      setIsSaving(true)
      if(!selectedRoom || !selectedRoom.value) {
        toast.error('Select a room first')
        return
      }

      await fetch(`${config.apiUrl}/room/${selectedRoom.value}/bulk`, {
        method: 'PUT',
        body: JSON.stringify({
          dates,
          availability,
          price
        })
      })

      toast.success('Saved!')
      router.push('/calendar')

    } catch (e) {
      setErrors(parseErrors(e))
      
      toast.error(e.error || 'Unable to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePriceChange = (value: string) => {
    setPrice(parseFloat(value))
  }

  const handleAvailabilityChange = (value: string) => {
    setAvailability(parseFloat(value))
  }

  const handleRoomSelect = (value: any) => {
    setSelectedRoom(value)
  }

  const canSubmit = (): boolean => {
    if(isSaving) {
      return false
    }

    // Room
    if(!selectedRoom || !selectedRoom.value) {
      return false
    }

    // Dates
    if(!dates.length) {
      return false
    }

    // At least availability or price
    if(typeof price !== 'number' && typeof availability !== 'number') {
      return false
    }

    return true
  }

  const loadRooms = async () => {
    try {
      const { payload: rooms } = await fetch(`${config.apiUrl}/rooms`)
      setRooms(rooms || [])
    } catch (e) {
      toast.error('Whoops, something wrong happened')
      // 
    }
  }
  
  /* Effects ----------------------------------------------------------- */
  // Reset errors
  useEffect(() => {
    setErrors({})
  }, [price, availability, dates, selectedRoom])

  useEffect(() => {
    if(!rooms.length) {
      loadRooms()
    }
  }, [])

  /* Rendering --------------------------------------------------------- */
  return (
    <div>
      <Title>Bulk Update</Title>

      <div className={'section'}>
        <Title headerType={'h2'}>Select Room</Title>
        <Select 
          placeholder={'Select Room'}
          options={formattedRooms}
          onChange={handleRoomSelect}
          value={selectedRoom} />
      </div>

      <div className={'section'}>
        <Title headerType={'h2'}>Select Days</Title>
        <DatesSelector onChange={setDates} value={dates} />
        <ErrorList list={errors.dates} />
      </div>

      <div className={'section'}>
        <Title headerType={'h2'}>Change Price</Title>
        <Input label={'MYR'} type={'number'} onChangeText={handlePriceChange} value={`${price || ''}`} />
        <ErrorList list={errors.price} />
      </div>

      <div className={'section'}>
        <Title headerType={'h2'}>Change Availability</Title>
        <Input type={'number'} onChangeText={handleAvailabilityChange} value={`${availability || ''}`} />
        <ErrorList list={errors.availability} />
      </div>

      <div className={'section'}>
        <Button disabled={!canSubmit()} onClick={save}>Save</Button>
      </div>

      <style jsx>{`
        .section {
          margin: 1em auto;
        }  
      `}</style>
    </div>
  )
}

export default BulkUpdate
