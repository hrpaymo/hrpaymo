import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';

const FeedTransaction = (props) => {
  let isDebit = props.transaction.amount && (props.transaction.amount[0] === '-');

  return (
    <div>
      <ListItem disabled={true}
        leftAvatar={<Avatar src={props.transaction.payer.avatarUrl || '/images/no-image.gif'} />}
        primaryText={
          <span>
            <span className='feed-item-user'>{props.transaction.payer.fullName}</span> paid <span className='feed-item-user'>{props.transaction.payee.fullName}</span>
            <p className='feed-item-note'>{props.transaction.note}</p>
          </span>
        }
        rightAvatar={
          <div className={isDebit ? 'feed-item-amount showDebit' : 'feed-item-amount'}>
            {props.transaction.amount}
          </div>
        }
        secondaryText={
         <div className='feed-item-timestamp'>{props.transaction.timestamp}</div>
        }
        secondaryTextLines={1}
      />
      {!props.isLastItem && <Divider />}
    </div>
  );
}

export default FeedTransaction;
