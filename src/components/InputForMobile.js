import React from "react";
import { Row, Button } from "reactstrap";
const InputForMobile = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  //pattern="\d*" maxlength="4"
  return (
    <div className="border-none font-size-14">
      <div className="flex-row">
        <label className="width-150 font-size-14">
        {label}{" "}
        <span className="must" hidden={!custom.required}>
          *
        </span>
      </label>
      <div className="flex-column">
      <div className="flex-row">
          <input
          style={{ width: "90%" }}
            {...input}
            placeholder={" "+label}
            type={type}
            autoComplete="off"
            min={0}
            disabled={custom.disabled}
            onWheel={event => {
              event.preventDefault();
            }}
            oninput={
              custom.maxLength
                ? (input.value = input.value.slice(0, custom.maxLength))
                : input.value
            }
          />
           <Button className="font-size-14 pd-0"
            style={{ height: "100%", width: "30%" }}
            disabled={input.value.length !== 10||custom.disabled}
            onClick={event => {custom.onPhoneNoVerify(input.value)}}
          >
            Verify
          </Button>
          </div>
          <div className="must font-size-14">
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
            </div>
      </div>
    </div>
    </div>
  );
};

export default InputForMobile;
