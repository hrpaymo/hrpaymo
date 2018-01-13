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

    let hasTransactions = this.props.transactions.items && this.props.transactions.items.length > 0;
    let showMoreButton = Boolean(this.props.transactions.nextPageTransactionId);

    // let displayedTransations = this.props.transactions && this.props.transactions.map((transaction) => {
    //   return (
    //     <FeedTransaction key={transaction.transactionId} transaction={transaction} />
    //   );
    // })

    return (
      <div>
        {!hasTransactions
          ? <div> No transactions available. </div>
          : <List>
              {this.props.transactions.items && this.props.transactions.items.map((transaction, i) => {
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
        {showMoreButton && <button onClick={ () => this.props.loadMoreFeed(this.props.type, this.props.userId) } >Show More</button>}
      </div>
    );
  }
}

export default Feed;