import React from 'react';

import ListItem from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

const FeedTransaction = (props) => {

  return (
    <div>
    <ListItem
      leftAvatar={<Avatar src={props.transaction.payer.avatarUrl || '/images/no-image.gif'} />}
      primaryText={
        <div>
          <span className='feed-item-user'>{props.transaction.payer.fullName}</span> paid <span className='feed-item-user'>{props.transaction.payee.fullName}</span>
        </div>
      }
      secondaryText={
       <div>{props.transaction.note}, {props.transaction.amount}</div>
      }
      secondaryTextLines={2}
    />
    </div>
  );
}

export default FeedTransaction;
