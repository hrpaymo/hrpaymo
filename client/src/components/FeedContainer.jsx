import React from 'react';
import Feed from './Feed.jsx'
import { Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';

class FeedContainer extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {

    let buttons = [];
    let feedComponent;
    let viewToDisplay = this.props.view || this.props.feeds[0].urlParam 

    this.props.feeds.forEach((feed) => {

      buttons.push(
        <Link to={`${this.props.base}?view=${feed.urlParam}`} key={feed.urlParam}>
          <button className={viewToDisplay === feed.urlParam ? 'feed-buttons selected' : 'feed-buttons'} >
            {feed.displayLabel}
          </button>
        </Link>
      );

      if (viewToDisplay === feed.urlParam) {
        feedComponent = <Feed 
            type={feed.feedType}
            transactions={feed.data}
            userId={this.props.userId}
            loadMoreFeed={this.props.loadMoreFeed} />
      }
    });

    return (
      <Paper className='feed-container'>
        <div className='feed-selections'>
          {buttons}
        </div>
        {feedComponent}
      </Paper>
    );
  }
}

export default FeedContainer;

