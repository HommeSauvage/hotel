import { useState } from 'react'
import Modal from '../elements/Modal'
import Input from '../control/Input'
import Error from '../text/Error'

type Props = {
  onEdited: (value: number, close: () => void) => void
  children: import('react').ReactNode
  message?: import('react').ReactNode | string
  buttonsDisabled?: boolean
}


const Editable = ({ children, buttonsDisabled, message, onEdited }: Props) => {
  /* State -------------------------------------------------------- */
  const [value, setValue] = useState<number | undefined>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  /* Handlers -------------------------------------------------------- */
  const handleInput = (value: string) => {
    setError(false)
    setValue(parseFloat(value))
  }
  const handleConfirm = () => {
    if(!value) {
      setError(true)
      return
    }
    onEdited(value, close)
  }

  const open = () => {
    setIsModalOpen(true)
  }
  const close = () => {
    setIsModalOpen(false)
  }

  /* Rendering -------------------------------------------------------- */
  return (
    <>
      <button onClick={open}>
        {children}
        <style jsx>{`
          button {
            background: transparent;
            outline: none;
            cursor: pointer;
            border: none;
            font-size: inherit;
          }  
        `}</style>
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={close}
        onConfirm={handleConfirm}
        onCancel={close}
        confirmText={'Save'}
        buttonsDisabled={buttonsDisabled}>
          <>
            <div className={'container'}>
              <div className={'message'}>
                {message}
              </div>
              {error && <Error>A number is required for this field</Error>}
              <div className={'input-wrapper'}>
                <Input type={'number'} value={`${value || ''}`} onChangeText={handleInput} />
              </div>
            </div>
            
            <style jsx>{`
              .container {
                padding: .3em;
              }
              .message {
                margin-bottom: .5em;
              }
              .container div {
                margin-right: .5em;
              }
              .input-wrapper {
                min-width: 200px;
              }
            `}</style>
          </>
      </Modal>
    </>
  )
}

export default Editable
