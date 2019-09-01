import { useState, useEffect } from 'react'
import uniq from 'lodash/uniq'
import { resolve } from 'styled-jsx/css'
import isEqual from 'lodash/isEqual'
import difference from 'lodash/difference'
import startOfDay from 'date-fns/startOfDay'
import isBefore from 'date-fns/isBefore'
import addDays from 'date-fns/addDays'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import DatePicker from './DatePicker'
import Check from './Check'

type Props = { 
  onChange: (value: Array<Date>) => void
  value?: Array<Date>
}

const checkStyles = resolve`
  label {
    min-width: 110px;
    display: inline-block;
  }
`

const weekdays = [
  'Sundays',
  'Mondays',
  'Tuesdays',
  'Wednesdays',
  'Thursdays',
  'Fridays',
  'Saturdays',
]

const DatesSelector = ({ onChange }: Props) => {
  /* State ---------------------------------------------------------------- */
  const [start, setStart] = useState<Date>(startOfDay(new Date()))
  const [end, setEndDate] = useState<Date>(addDays(start, 1))
  const [daysOfWeek, setDaysOfWeek] = useState<Array<number>>([...weekdays.keys()])
  
  /* Handlers ------------------------------------------------------------ */
  const calculateDates = () => {
    if(isBefore(end, start)) {
      onChange([])
      return
    }

    // remove the dates
    let dates = eachDayOfInterval({ start, end })
    
    dates = dates.filter((date: Date) => {
      return daysOfWeek.indexOf(date.getDay()) !== -1
    })

    onChange(dates)
  }

  const toggleDaysOfWeek = (d: number | Array<number>) => {
    const days: Array<number> = typeof d === 'number' ? [d] : d

    // No worries here, React will batch the state updates
    const newArray: Array<number> = difference(days, daysOfWeek)
    if(newArray.length) {
      const dow = uniq([...daysOfWeek, ...days])
      dow.sort()
      setDaysOfWeek(dow)
    } else {
      newArray.sort()
      setDaysOfWeek(newArray)
    }
  }

  /* Effects ------------------------------------------------------------ */
  // Recalculate the dates
  useEffect(() => {
    calculateDates()
  }, [start, end, daysOfWeek])

  /* Rendering ------------------------------------------------------------ */
  return (
    <div>
      <div className={'range'}>
        <div className={'picker'}>
          <DatePicker
            label={'From'}
            selected={start}
            onChange={(date: Date) => setStart(date)}
            selectsStart
            startDate={start}
            endDate={end} />
        </div>
        <div className={'picker'}>
          <DatePicker
            label={'To'}
            selected={end}
            onChange={(date: Date) => setEndDate(date)}
            selectsEnd
            startDate={start}
            endDate={end}
            minDate={start} />
        </div>
      </div>

      <div className={'refine'}>
        <div className={'helpers'}>
          <Check
            className={checkStyles.className}
            checked={isEqual(daysOfWeek, [...weekdays.keys()])} 
            onChange={() => toggleDaysOfWeek([...weekdays.keys()])} 
            title={'All days'} />
          <Check 
            className={checkStyles.className}
            checked={difference([0, 6], daysOfWeek).length === 0} 
            onChange={() => toggleDaysOfWeek([0, 6])} 
            title={'Weekends'} />
          <Check 
            className={checkStyles.className}
            checked={difference([1, 2, 3, 4, 5], daysOfWeek).length === 0} 
            onChange={() => toggleDaysOfWeek([1, 2, 3, 4, 5])} 
            title={'Weekdays'} />
        </div>
        
        <div className={'days'}>
          {weekdays.map((day, index) => (
            <Check
              key={day}
              className={checkStyles.className}
              checked={daysOfWeek.indexOf(index) !== -1} 
              onChange={() => toggleDaysOfWeek(index)} 
              title={day} />
          ))}
        </div>
      </div>

      {checkStyles.styles}
      <style jsx>{`
        .range {
          display: flex;
          justify-content: space-between;
        }
        .picker:first-child {
          margin-left: 0;
        }
        .picker {
          width: 49%;
        }
        .helpers {
          margin-top: .5em;
          margin-bottom: .5em;
        }
      `}</style>
    </div>
  )
}
export default DatesSelector
