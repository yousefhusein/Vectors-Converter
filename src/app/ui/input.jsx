export default function Input({ formLabel, ...props }) {
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
      <input className="form-input shadow-none w-full min-h-12" {...props} />
    </div>
  )
}
