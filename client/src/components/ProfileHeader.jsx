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
};

class ProfileHeader extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
        <Card style={card_style}>
          <CardHeader
            title={this.props.profileInfo.fullName}
            subtitle={this.props.profileInfo.username}
            avatar={this.props.profileInfo.avatarUrl || '/images/no-image.gif'}
          />
        </Card>
    );
  }
}

export default ProfileHeader;
