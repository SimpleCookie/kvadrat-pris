
interface Props {
  label: string
  onChange: (value: number) => void
  defaultValue?: number
}
export const BasicNumberInput = ({ label, onChange, defaultValue }: Props) => {

  return (
    <label className="label" htmlFor={label}>
      <span className="label-text">{label}</span>
      <input
        type="number"
        name={label}
        defaultValue={defaultValue || 0}
        onChange={(e) => onChange(+e.target.value)}
      />
    </label>
  )
}