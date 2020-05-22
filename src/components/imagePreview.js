import React from "react";
import PropTypes from "prop-types";

const ImagePreview = ({ imagefile,onRemove }) =>
  imagefile.map(({ name, preview, size,img_id,index,img_type}) => (
    <div key={index} className="render-preview">
      <div className="image-container">
        <img src={preview} alt={name} />
      </div>
      {onRemove?<div><span onClick={()=>onRemove(img_id,img_type,index)} className="remove-btn">Remove</span></div>:<div/>}
      <div className="details" hidden={size===0}>
        {name} - {(size / 1024000).toFixed(2)}MB
      </div>
    </div>
  ));

ImagePreview.propTypes = {
  imagefile: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.file,
      name: PropTypes.string,
      preview: PropTypes.string,
      size: PropTypes.number
    })
  )
};

export default ImagePreview;