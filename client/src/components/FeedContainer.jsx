import React from 'react';
import Feed from './Feed.jsx'

class FeedContainer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      view: 'mine'
    }
  }

  changeFeedView(view) {
    this.setState({
      view: view
    })
  }

  render() {
    return (
      <div className='feed-container'>
        <div className='feed-selections'>
          <button 
            className={this.state.view === 'mine' ? 'feed-buttons selected' : 'feed-buttons'} 
            onClick={this.changeFeedView.bind(this, 'mine')}>
            Mine
          </button>
          <button 
            className={this.state.view === 'global' ? 'feed-buttons selected' : 'feed-buttons'}
            onClick={this.changeFeedView.bind(this, 'global')}>
            Public
          </button>
        </div>
        {this.state.view === 'mine'
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
      </div>
    );
  }
}

export default FeedContainer;