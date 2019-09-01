type Props = {
  className?: string
  onChange: (value: boolean) => any
} & import('react').HTMLProps<HTMLInputElement>

const Check = ({ className, title, checked, onChange, ...props }: Props) => {
  /* Handling ------------------------------------------------------- */
  const handleChange = (event: import('react').ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked)
  }

  /* Rendering ------------------------------------------------------- */
  return (
    <label className={className}>
      <input 
        type={'checkbox'} 
        checked={checked} 
        onChange={handleChange} 
        {...props} /> {title}
    </label>
  )
}

export default Check
