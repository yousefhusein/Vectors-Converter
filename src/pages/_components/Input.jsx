import React from "react";

export default function Input({ formLabel, ...props }) {
  return (
    <div className="form-group">
      <label
        className="form-label fw-bold fs-5"
        htmlFor={props.id}
        style={{ marginBottom: "-10px" }}>
        {formLabel}
        {props.required ? <span className="text-danger"> *</span> : ""}
      </label>
      <input className="form-control shadow-none form-control-lg" {...props} />
    </div>
  );
}
