import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Payment from '../components/Payment.jsx';
import FeedContainer from '../components/FeedContainer.jsx';
import MiniProfile from '../components/MiniProfile.jsx';
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
    this.loadProfileData();
  }

  loadProfileData(username) {
    axios('/fullprofile', {params: {username: username}})
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
        This user is: 
        {this.state.profileInfo && this.state.profileInfo.username}
        <Payment 
          payerId={this.props.userInfo.userId} 
          refreshUserData={this.props.refreshUserData} />
      </div>
    );
  }
}

export default Home;