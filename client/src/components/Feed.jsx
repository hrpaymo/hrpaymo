import React from 'react';
import FeedTransaction from './FeedTransaction.jsx'
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';

class Feed extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    // let displayedTransations = this.props.transactions && this.props.transactions.map((transaction) => {
    //   return (
    //     <FeedTransaction key={transaction.transactionId} transaction={transaction} />
    //   );
    // })

    return (
      <div>
        {!this.props.transactions
          ? <div> No transactions. </div>
          : <List>
              {this.props.transactions && this.props.transactions.map((transaction, i) => {
                  return (
                    <div key={transaction.transactionId}>
                      <ListItem disabled={true}
                        leftAvatar={<Avatar src={transaction.payer.avatarUrl || '/images/no-image.gif'} />}
                        primaryText={
                          <div>
                            <span className='feed-item-user'>{transaction.payer.fullName}</span> paid <span className='feed-item-user'>{transaction.payee.fullName}</span>
                            <div className='feed-item-note'>{transaction.note}</div>
                          </div>
                        }
                        secondaryText={
                         <div className='feed-item-timestamp'>{transaction.timestamp}</div>
                        }
                        secondaryTextLines={1}
                      />
                      {i !== this.props.transactions.length - 1 && <Divider/>}
                    </div>
                  );
                })
              }
            </List>
        }
      </div>
    );
  }
}

export default Feed;