import React from 'react';
import FeedTransaction from './FeedTransaction.jsx'

class Feed extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3>Global Feed</h3>
        {this.props.globalFeed && this.props.globalFeed.map((transaction) => {
          return (<FeedTransaction key={transaction.transactionId} transaction={transaction} />);
        })}
      </div>
    );
  }
}

export default Feed;