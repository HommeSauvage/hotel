import { useMemo, Fragment } from 'react'
import find from 'lodash/find'
import format from "date-fns/format"
import startOfMonth from "date-fns/startOfMonth"
import endOfMonth from "date-fns/endOfMonth"
import eachDayOfInterval from "date-fns/eachDayOfInterval"
import colors from '../../theme/colors'
import { isSameDay } from 'date-fns';
import Editable from '../text/Editable'
import Title from '../text/Title'
import MonthSelectorButton from './MonthSelectorButton';

export interface RoomDetail {
  availability: number
  price: import('@hotel/models/types').Money
}

export interface FormattedRoom {
  _id: any,
  name: string
  details: Array<RoomDetail>
}

type IRoom = import('@hotel/models/types').IRoom
type ICustomPricing = import('@hotel/models/types').ICustomPricing
type IAvailability = import('@hotel/models/types').IAvailability
export interface Props {
  rooms: Array<IRoom>
  around: Date
  onChangeAround?: (date: Date) => void
  actionsDisabled?: boolean
  onChangedPrice?: (roomId: string, update: import('./types').DateUpdate, callback?: () => void) => void
  onChangedAvailability?: (roomId: string, update: import('./types').DateUpdate, callback?: () => void) => void
}

const Calendar = ({ rooms, around, onChangeAround, onChangedPrice, onChangedAvailability, actionsDisabled }: Props) => {
  /* State ------------------------------------------------------------- */
  const dates = useMemo<Array<Date>>(() => {
    const start = startOfMonth(around)
    const end = endOfMonth(around)
    return eachDayOfInterval({ start, end })
  }, [around])

  const formattedRooms = useMemo<Array<FormattedRoom>>(() => {
    const formatted = rooms.map((room: IRoom): FormattedRoom => {
      return {
        _id: room._id,
        name: room.name,
        details: dates.map((date: Date): RoomDetail => {
          const priceOnDay = find<ICustomPricing>(room.customPricing, (custom: ICustomPricing) => {
            return isSameDay(new Date(custom.date), date)
          })
          const availability = find<IAvailability>(room.availability, (av: IAvailability) => {
            return isSameDay(new Date(av.date), date)
          })

          return {
            price: priceOnDay ? priceOnDay.price : room.pricing.default, // TODO weekday default
            availability: availability ? availability.available : room.total
          }
        })
      }
    })
    return formatted
  }, [rooms, dates])

  /* Handlers ------------------------------------------------------------- */


  /* Rendering ------------------------------------------------------------- */
  return (
    <div className={'calendar'}>
      <Title>Calendar</Title>

      <div className={'table-wrap'}>
        <table>
          
          <thead>
            <tr>
              <th className={'first tall'} rowSpan={3}></th>
              <th className={'months'} colSpan={dates.length}>
                <MonthSelectorButton 
                  value={around} 
                  onChange={onChangeAround} />
              </th>
            </tr>
            <tr>
              <th className={'second'}>&nbsp;</th>
              {dates.map((date: Date) => (
                <th key={date.toISOString()}>
                  {format(new Date(date), 'EEEE')}
                </th>
              ))}
            </tr>
            <tr>
            <th className={'second'}>&nbsp;</th>
              {dates.map((date: Date, index) => (
                <th key={date.toISOString()}>
                  {index + 1}
                </th>)
              )}
            </tr>
          </thead>

          <tbody>
            {formattedRooms.map((room: FormattedRoom) => (
              <Fragment key={room._id}>
                <tr>
                  <td className={'first'}>{room.name}</td>
                  <td colSpan={dates.length}>&nbsp;</td>
                </tr>
                <tr>
                  <td className={'first'}>Rooms Available</td>
                  {dates.map((date: Date, index) => (
                    <td key={date.toISOString()}>
                      <Editable
                        buttonsDisabled={actionsDisabled} 
                        message={<span>You're editing the <strong>availability</strong> of the room <strong>{room.name}</strong> for the date <strong>{format(date, 'dd-M-yyyy')}</strong></span>} 
                        onEdited={(value, close) => onChangedAvailability && onChangedAvailability(room._id, { date, value }, close)}>
                        {room.details[index].availability}
                      </Editable>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className={'first'}>Price</td>
                  {dates.map((date: Date, index) => (
                    <td key={date.toISOString()}>
                      <Editable 
                        buttonsDisabled={actionsDisabled}
                        message={<span>You're editing the <strong>price</strong> of the room <strong>{room.name}</strong> for the date <strong>{format(date, 'dd-M-yyyy')}</strong></span>} 
                        onEdited={(value, close) => onChangedPrice && onChangedPrice(room._id, { date, value }, close)}>
                        {room.details[index].price.currency} {room.details[index].price.value}
                      </Editable>
                    </td>
                  ))}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .calendar {
          position: relative;
          overflow:hidden;
        }
        .table-wrap {
          width: 100%;
	        overflow: auto;
        }
        .months {
          position: fixed;
          height: 30px;
          width: 100%;
          border-top: none;
        }
        table {
          width: 100%;
          border-spacing: 0;
          overflow-x: scroll;
          border-bottom: 1px solid ${colors.separator};
          border-top: 1px solid ${colors.separator};
        }
        td, th {
          border-top: 1px solid ${colors.separator};
          min-width: 7em;
          
        }
        .tall {
          height: 90px;
        }
        td.first, th.first {
          position: fixed;
          z-index: 10;
          width: 10em; 
          background:#ffffff;
          border-right: 1px solid ${colors.separator};
          border-left: 1px solid ${colors.separator};
        }
        td.second, th.second {
          width: 10em; 
        }
        td {
          padding: .5em;
        }
        tr:nth-child(3n - 2) td {
          background: ${colors.tableShade1};
        }
        tr:nth-child(6n - 2) td {
          background: ${colors.tableShade2};
        }
        td:last-child, th:last-child{
          border-right: 1px solid ${colors.separator};
        }
        thead tr {
          height: 30px;
        }

        @media (min-width: 768px) {
          .months {
            width: calc(100% - 10em);
          }
          td, th {
            border-top: 1px solid ${colors.separator};
            min-width: 10em;
          }
        }
      `}</style>
    </div>
  )
}

export default Calendar
