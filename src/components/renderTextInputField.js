import React from "react";
import { Row } from "reactstrap";

const renderTextInputField = ({
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
    <div className="border-none font-size-14">
      <div className="flex-row">
        <label className="width-150">
          {label}
          <span className="must" hidden={!custom.required}>
            *
          </span>
        </label>
        <div>
          <input
            {...input}
            placeholder={" " + label}
            type={type}
            autoComplete="off"
            min={0}
            disabled={custom.disabled}
            onWheel={(event) => {
              event.preventDefault();
            }}
            oninput={
              custom.maxLength
                ? (input.value = input.value.slice(0, custom.maxLength))
                : input.value
            }
          />
          <div className="font-size-12 must width-250">
            {touched &&
              ((error && <span>{error}</span>) ||
                (warning && <span>{warning}</span>))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default renderTextInputField;
