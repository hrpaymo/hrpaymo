import React from 'react';
import FeedTransaction from './FeedTransaction.jsx'
import GlobalFeed from './GlobalFeed.jsx';
import MyFeed from './MyFeed.jsx';

class Feed extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {

    let listedTransactions = this.props.transactions.items && this.props.transactions.items.map((transaction) => 
      {return (
        <FeedTransaction key={transaction.transactionId} transaction={transaction} />);
      }
    )

    let hasTransactions = this.props.transactions.items && this.props.transactions.items.length > 0;
    let showMoreButton = Boolean(this.props.transactions.nextPageTransactionId);

    return (
      <div>
        {hasTransactions
          ? listedTransactions
          : <div> No transactions available.</div>
        }
        {showMoreButton && <button onClick={ () => this.props.loadMoreFeed(this.props.type, this.props.userId) } >Show More</button>}
      </div>
    );
  }
}

export default Feed;