export default function Input({ formLabel, ...props }) {
  return (
    <div className="form-group mb-2">
      <label
        className="form-label fw-bold"
        htmlFor={props.id}
        style={{ marginBottom: '-10px' }}
      >
        {formLabel}
        {props.required ? <span className="text-danger"> *</span> : ''}
      </label>
      <input className="form-control shadow-none form-control" {...props} />
    </div>
  )
}
