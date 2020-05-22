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
    <div>
      <label>
        {label}{" "}
        <span className="must" hidden={!custom.required}>
          *
        </span>
      </label>
      <div>
        <Row style={{ padding: "0px", margin: "0px" ,border:"0px"}}>
          <input
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
            style={{ height: "100%", width: "90%" }}
          />
          <Button
            style={{ height: "100%", width: "10%" }}
            disabled={input.value.length !== 10||custom.disabled}
            onClick={event => {custom.onPhoneNoVerify(input.value)}}
          >
            Verify
          </Button>
        </Row>
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};

export default InputForMobile;
