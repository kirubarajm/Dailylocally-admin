import React from "react";

const renderInputField = ({
  input,
  label,
  disabled,
  placeholder,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  //pattern="\d*" maxlength="4"
  return (
    <div hidden={custom.fieldhidden} className="border-none">
      <label hidden={!label} className="width-150 mr-0 font-size-14">
        {label}{" "}
        <span className="must" hidden={!custom.required}>
          *
        </span>
      </label>
      <span>
        {input.name === "phoneno" ? (
          <input
            {...input}
            placeholder={placeholder}
            type={type}
            autoComplete="off"
            min={0}
            disabled={disabled}
            onWheel={(event) => {
              event.preventDefault();
            }}
            oninput={
              custom.maxLength
                ? (input.value = input.value.slice(0, custom.maxLength))
                : input.value
            }
          />
        ) : (
          <input
            {...input}
            placeholder={placeholder}
            type={type}
            disabled={disabled}
            autoComplete="off"
            onWheel={(event) => {
              event.stopPropagation();
            }}
          />
        )}
        <div className="product_error mr-t-10">
          {touched &&
            ((error && <span>{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </div>
      </span>
    </div>
  );
};

export default renderInputField;
