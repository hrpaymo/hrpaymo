import React from 'react';
import Navbar from './Navbar.jsx';
import Payment from './Payment.jsx';
import FeedContainer from './FeedContainer.jsx';
import ProfileHeader from './ProfileHeader.jsx';
import axios from 'axios';

class Profile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      profileInfo: {},
      unknownUser: false
    }
  }

  componentDidMount() {
    this.loadProfileData(this.props.match.params.username);
  }

  loadProfileData(username) {
    axios('/publicprofile', {params: {username: username}})
      .then((response) => {
        this.setState({
          profileInfo: response.data
        });
      })
      .catch((err) =>{
        this.setState({
          unknownUser: true
        })
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <Navbar 
          isLoggedIn={this.props.isLoggedIn} 
          logUserOut={this.props.logUserOut} />
        {this.state.unknownUser 
          ? <div>User does not exist</div>
          : <span>
              <ProfileHeader profileInfo={this.state.profileInfo}/>
            </span>
        }
      </div>
    );
  }
}

export default Profile;