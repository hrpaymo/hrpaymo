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

    return (
      <Paper className='feed-container'>
        <div className='feed-selections'>
          <Link to="/?view=mine">
            <button className={this.props.view === 'mine' ? 'feed-buttons selected' : 'feed-buttons'} >
              Mine
            </button>
          </Link>
          <Link to="/?view=public">
            <button className={this.props.view === 'public' ? 'feed-buttons selected' : 'feed-buttons'} >
              Public
            </button>
          </Link>
        </div>
        {this.props.view === 'mine'
          ? <Feed 
              type='mine'
              userId={this.props.userId}
              loadMoreFeed={this.props.loadMoreFeed} 
              transactions={this.props.userFeed} />
          : <Feed 
              type='public'
              userId={this.props.userId}
              loadMoreFeed={this.props.loadMoreFeed} 
              transactions={this.props.globalFeed} />}
      </Paper>
    );
  }
}

export default FeedContainer;

