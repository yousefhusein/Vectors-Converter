import React from "react";

export default function Select({ formLabel, options, ...props }) {
  return (
    <div className="form-group mb-2">
      <label
        className="form-label fw-bold fs-5"
        htmlFor={props.id}
        style={{ marginBottom: "-10px" }}>
        {formLabel}
        {props.required ? <span className="text-danger"> *</span> : ""}
      </label>
      <select
        className="form-select shadow-none form-select-lg"
        style={{ cursor: "pointer" }}
        {...props}>
        {options.map((option, index) => (
          <option value={option.value.toString()} key={index}>
            {option.label || option.value}
          </option>
        ))}
      </select>
    </div>
  );
}
