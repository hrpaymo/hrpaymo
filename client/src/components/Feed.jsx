import React from 'react';
import FeedTransaction from './FeedTransaction.jsx'
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class Feed extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {

    let hasTransactions = this.props.transactions && this.props.transactions.items && this.props.transactions.items.length > 0;
    let showMoreButton = hasTransactions ? Boolean(this.props.transactions.nextPageTransactionId) : false;

    return (
      <div>
        <div>
          {!hasTransactions
            ? <div> No transactions available. </div>
            : <List>
                {this.props.transactions.items && this.props.transactions.items.map((transaction, i) => {
                  let isLastItem = i === this.props.transactions.items.length - 1;
                  return (
                    <FeedTransaction key={transaction.transactionId} isLastItem={isLastItem} transaction={transaction} />
                  );
                })}
              </List>
          }
        </div>
        <div className='show-more'>
          {showMoreButton && <button className='btn' onClick={ () => this.props.loadMoreFeed(this.props.type, this.props.userId) } >Show More</button>}
        </div>
      </div>
    );
  }
}

export default Feed;
