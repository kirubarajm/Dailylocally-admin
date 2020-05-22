
import React from "react";
const InputTextArea = ({
    input,
    label,
    type,
    meta: { touched, error, warning },
    ...custom
    //
  }) => {
    return (
      <div>
        <div>
          <textarea
            {...input}
            placeholder={label}
            type={type}
            autoComplete="off"
            cols={custom.cols}
            rows={custom.rows}
          />
          <span style={{ flex: "0", WebkitFlex: "0", height: "20px" }}>
            {touched &&
              ((error && <span>{error}</span>) ||
                (warning && <span>{warning}</span>))}
          </span>
        </div>
      </div>
    );
  };
  export default InputTextArea;