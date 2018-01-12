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
          <div className="profile-avatar">Avatar</div>
          <div className="profile-name">Name</div>
          <div className="profile-username">Username</div>
          <div className="profile-balance">{this.props.balance}</div>
        </div>
      </div>
    );
  }
}

export default MiniProfile;