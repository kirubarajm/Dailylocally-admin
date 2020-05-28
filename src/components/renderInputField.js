import React from "react";

const renderInputField = ({
  input,
  label,
  placeholder,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  //pattern="\d*" maxlength="4"
  return (
    <div hidden={custom.fieldhidden} className="mr-t-10">
      <label hidden={!label}>
        {label}{" "}
        <span className="must" hidden={!custom.required}>
          *
        </span>
      </label>
      <div>
        {input.name === "phoneno" ? (
          <input
            {...input}
            placeholder={placeholder}
            type={type}
            autoComplete="off"
            min={0}
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
            autoComplete="off"
            onWheel={(event) => {
              event.stopPropagation();
            }}
          />
        )}

        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};

export default renderInputField;
