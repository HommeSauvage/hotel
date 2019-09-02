import { useState } from 'react'
import format from 'date-fns/format'
import DatePicker from '../control/DatePicker'
import { TransparentButton } from '../control/Button'
import Modal from '../elements/Modal'

type Props = {
  value?: Date
  onChange?: (value: Date) => void
}

const MonthSelectorButton = ({ value, onChange }: Props) => {
  /* State ----------------------------------------------------------------- */
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [date, setDate] = useState<Date>(value || new Date())

  /* Handlers ----------------------------------------------------------------- */
  const close = () => {
    setIsModalOpen(false)
  }

  const handleConfirm = () => {
    if(onChange) {
      onChange(date)
    }
    close()
  }

  /* Render ----------------------------------------------------------------- */
  return (
    <>
      <TransparentButton style={{ padding: 0 }} onClick={() => setIsModalOpen(true)}>
        {format(date, 'MMMM yyyy')}
      </TransparentButton>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={close}
        onConfirm={handleConfirm}
        onCancel={close}>
        <DatePicker
          selected={date}
          onChange={(date: Date) => setDate(date)}
          inline
          showMonthYearPicker
        />
      </Modal>
    </>
  )
}

export default MonthSelectorButton