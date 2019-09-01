import { useRef, useEffect } from 'react'
import { resolve } from 'styled-jsx/css'
import ReactModal from 'react-modal'
import Container from '../layout/Container'
import { TransparentButton } from '../control/Button'
import colors from '../../theme/colors'

const modalStyles = resolve`
  .modal {
    z-index: 10001;
    justify-content: center;
    flex-direction: column;
    align-tems: center;
    display: flex;
    outline: none;
  }
`
const overlayStyles = resolve`
  .ReactModal__Overlay {
    
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .6);
    z-index: 10000;
    justify-content: center;
    align-tems: center;
    display: flex;
    opacity: 0;
    transition: opacity 150ms ease-in-out;
  }

  .ReactModal__Overlay--after-open {
    opacity: 1;
  }

  .ReactModal__Overlay--before-close {
    opacity: 0;
  }
`
const buttonStyles = resolve`
  .button {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    justify-content: center;
    align-items: center;
    padding: 15px;
    background-color: ${colors.white};
  }

  .gray {
    color: ${colors.black};
  }
`

type Props = {
  onCancel?: () => void | null
  onConfirm?: () => void | null
  buttonsDisabled?: boolean
  confirmText?: import('react').ReactNode | string
  children?: import('react').ReactNode
} & ReactModal.Props

const Modal = ({ children, onCancel, onConfirm, buttonsDisabled, confirmText, ...props }: Props) => {
  /* State ----------------------------------------------------------- */
  const modal = useRef<HTMLElement>()

  /* Handlers ----------------------------------------------------------- */
  const handleClickOutside = (event: Event) => {
    if(event.target === modal.current && onCancel) {
      onCancel()
    }
  }

  /* Effects ----------------------------------------------------------- */
  useEffect(() => {
    // We need this for accessibility so that the app has an aria-hidden attribute
    // @ts-ignore we always have the #__next in the page
    ReactModal.setAppElement(document.getElementById('__next'))
    
    window.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  /* Rendering ----------------------------------------------------------- */
  return (
    <ReactModal
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      closeTimeoutMS={150}
      className={`modal ${modalStyles.className}`}
      overlayClassName={`overlay ${overlayStyles.className}`}
      contentRef={(ref) => modal.current = ref}
      {...props}>
      <Container>
        <div className={'modal-content'}>
          <div className={'content'}>
            {children}
          </div>

          <div className={'buttons'}>
            {(onCancel !== null) && (
              <TransparentButton
                disabled={buttonsDisabled}
                className={`gray ${buttonStyles.className}`}
                onClick={onCancel}>
                Close
              </TransparentButton>
            )}

            {(onCancel !== null) && (onConfirm !== null) &&
              <div className={'vertical-separator'} />}

            {(onConfirm !== null) && (
              <TransparentButton
                disabled={buttonsDisabled}
                className={buttonStyles.className}
                onClick={onConfirm}>
                {confirmText || 'Yes'}
              </TransparentButton>
            )}
          </div>
        </div>
      </Container>
      {modalStyles.styles}
      {overlayStyles.styles}
      {buttonStyles.styles}
      <style jsx>{`
        .content {
          padding: 22px;
        }

        .vertical-separator {
          background-color: ${colors.veryLightGray};
          width: 1px;
        }

        .buttons {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          border-top-style: solid;
          border-top-width: 1px;
          border-top-color: ${colors.veryLightGray};
        }

        .modal-content {
          display: flex;
          flex-direction: column;
          background-color: white;
          justify-content: center;
          border-radius: 4px;
          border-color: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </ReactModal>
  )
}

export default Modal
