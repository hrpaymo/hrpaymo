import React from 'react';

class MiniProfile extends React.Component {
  constructor (props) {
    super(props);
  }



  render() {
    return (
      <div>
        <h4>User Info</h4>
        <div className="profile-container">
          <div className="profile-avatar">
            <img className='feed-avatar' width='50' height='50' src={this.props.userInfo.avatarUrl || '/images/no-image.gif'} />
          </div>
          <div className="profile-name">{this.props.userInfo.displayName}</div>
          <div className="profile-username">{this.props.userInfo.username}</div>
          <div className="profile-balance">Current Balance: ${this.props.balance}</div>
        </div>
      </div>
    );
  }
}

export default MiniProfile;