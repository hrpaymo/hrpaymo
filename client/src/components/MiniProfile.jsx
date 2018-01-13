import React from 'react';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const card_style = {
  position: 'relative',
  height: 150,
  width: 250,
  margin: 10,
  textAlign: 'center',
  display: 'inline-block',
  float: 'right',
};
// const av_style = {
//   height: 50,
//   width: 50,
//   textAlign: 'center',
//   display: 'block',
// };
// const div_style = {
//   'margin-top': 25
// };
// const bal_style = {
//   'margin-top': 80
// };
class MiniProfile extends React.Component {
  constructor (props) {
    super(props);
  }

      // <div>
      //   <h4>User Info</h4>
      //   <div className="profile-container">
      //     <div className="profile-avatar">
      //       <img className='feed-avatar' width='50' height='50' src={this.props.userInfo.avatarUrl || '/images/no-image.gif'} />
      //     </div>
      //     <div className="profile-name">{this.props.userInfo.displayName}</div>
      //     <div className="profile-username">{this.props.userInfo.username}</div>
      //     <div className="profile-balance">Current Balance: ${this.props.balance}</div>
      //   </div>
      // </div>

  render() {
    return (
     
        <Card style={card_style}>
          <CardHeader
            title={this.props.userInfo.displayName}
            subtitle={this.props.userInfo.username}
            avatar={this.props.userInfo.avatarUrl || '/images/no-image.gif'}
          />
          {/*<CardTitle title={this.props.userInfo.displayName} subtitle={this.props.userInfo.username} />*/}
          <Divider />
          <CardText>
            Current Balance: ${this.props.balance}
          </CardText>
        </Card>
    );
  }
}

export default MiniProfile;
