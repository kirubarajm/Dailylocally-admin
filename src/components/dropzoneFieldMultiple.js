import React from "react";
import PropTypes from "prop-types";
import DropZone from "react-dropzone";
import ImagePreview from "./imagePreview";
import Placeholder from "./placeholder";
import ShowError from "./showError";


const DropzoneFieldMultiple = ({
  handleOnDrop,
  handleonRemove,
  input,
  handleonChange,
  imagefile,
  imgPrefillDetail,
  label,
  index,
  meta: { error, touched }
}) => imgPrefillDetail?(<ImagePreview imagefile={[{ name:'', preview:imgPrefillDetail.img_url, size:0, img_id:imgPrefillDetail.img_id,index:index,img_type:imgPrefillDetail.type}]} onRemove={handleonRemove}/>):(
  <div className="preview-container">
    <DropZone
      accept="image/jpeg, image/png, image/gif, image/bmp"
      className="upload-container"
      onDrop={handleOnDrop(index)}
      onChange={handleonChange?file=>handleonChange(file,index):file => input.onChange(file)}
    >
      {imagefile && imagefile.length > 0 ? (
        <ImagePreview imagefile={imagefile} />
      ) :(
        <Placeholder error={error} touched={touched} />
      )}
    </DropZone>
    {touched && error && <ShowError error={error} />}
  </div>
);

DropzoneFieldMultiple.propTypes = {
  handleOnDrop: PropTypes.func.isRequired,
  input: PropTypes.shape({
    name: PropTypes.string,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.shape({
      preview: PropTypes.string
    })
  }),
  imagefile: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  label: PropTypes.string,
  touched: PropTypes.bool,
  error: PropTypes.string
};
export default DropzoneFieldMultiple;