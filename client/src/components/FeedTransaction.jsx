import React from 'react';

const FeedTransaction = (props) => {

  return (
    <div className='feed-container'>
      <img className='feed-avatar' width='50' height='50' src={props.transaction.payer.avatarUrl || '/images/no-image.gif'} />
      <div className='feed-transaction'>
        <div><span className='feed-user'>{props.transaction.payer.fullName}</span> paid <span className='feed-user'>{props.transaction.payee.fullName}</span></div>
        <div className='feed-timestamp'>{props.transaction.timestamp}</div>
        <div>{props.transaction.note}</div>
      </div>
    </div>
  );
}

export default FeedTransaction;
