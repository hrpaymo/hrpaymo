import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Payment from '../components/Payment.jsx';
import FeedContainer from '../components/FeedContainer.jsx';
import ProfileHeader from '../components/ProfileHeader.jsx';
import axios from 'axios';

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      profileInfo: {}
    }
  }

  componentDidMount() {
    console.log(this.props.match.params.username);
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
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <Navbar/>
        <ProfileHeader userInfo={this.state.profileInfo}/>
        <Payment 
          payerId={this.props.userInfo.userId} 
          refreshUserData={this.props.refreshUserData} />
      </div>
    );
  }
}

export default Home;