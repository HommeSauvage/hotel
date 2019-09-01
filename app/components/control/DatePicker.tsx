import ReactDatePicker from 'react-datepicker'
import Head from 'next/head'
import Input from './Input'

type Props = {
  label?: import('./Input').Props['label']
  style?: import('./Input').Props['style']
  icon?: import('./Input').Props['icon']
} & import('react-datepicker').ReactDatePickerProps

const DatePicker = ({ label, style, icon, customInput, ...props }: Props) => (
  <>
    <Head>
      <link key="react-datepicker" rel="stylesheet" href="https://unpkg.com/react-datepicker@2.9.3/dist/react-datepicker.min.css" />
    </Head>
    <ReactDatePicker
      {...props}
      customInput={customInput || <Input style={style} icon={icon} label={label} />} />
    <style jsx global>{`
      .react-datepicker-wrapper, .react-datepicker__input-container {
        display: block!important;
      }
    `}</style>
  </>
)
export default DatePicker
