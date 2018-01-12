import React from 'react';

const FeedTransaction = (props) => {

  return (
    <div className='feed-item-container'>
      <img className='feed-item-avatar' width='50' height='50' src={props.transaction.payer.avatarUrl || '/images/no-image.gif'} />
      <div className='feed-item-transaction'>
        <div><span className='feed-item-user'>{props.transaction.payer.fullName}</span> paid <span className='feed-item-user'>{props.transaction.payee.fullName}</span></div>
        <div className='feed-item-timestamp'>{props.transaction.timestamp}</div>
        <div>{props.transaction.note}</div>
      </div>
    </div>
  );
}

export default FeedTransaction;
