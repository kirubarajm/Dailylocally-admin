import React from 'react';

const MessageView = (props) => {
  return (
    <div className='page-message-view'>
        <div>{props.message}</div>
    </div>
  );
};

export default MessageView;
