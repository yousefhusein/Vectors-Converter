export default function Select({ formLabel, options, ...props }) {
  return (
    <div className="relative mb-2 px-2">
      <label
        className="font-bold"
        htmlFor={props.id}
        style={{ marginBottom: '-10px' }}
      >
        {formLabel}
        {props.required ? <span className="text-red-800"> *</span> : ''}
      </label>
      <select
        className="form-select shadow-none w-full min-h-12"
        style={{ cursor: 'pointer' }}
        {...props}
      >
        {options
        && options.map((option, index) => (
          <option value={option.value.toString()} key={index}>
            {option.label || option.value}
          </option>
        ))}
      </select>
    </div>
  )
}
