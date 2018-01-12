import React from 'react';
import FeedTransaction from './FeedTransaction.jsx'

class Feed extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    let displayedTransations = this.props.transactions && this.props.transactions.map((transaction) => {
      return (<FeedTransaction key={transaction.transactionId} transaction={transaction} />);
    })

    return (
      <div>
        {!this.props.transactions
          ? <div> No transactions. </div>
          : displayedTransations
        }
      </div>
    );
  }
}

export default Feed;