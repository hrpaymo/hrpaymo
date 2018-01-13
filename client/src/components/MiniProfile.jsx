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

class MiniProfile extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
     
        <Card style={card_style}>
          <CardHeader
            title={this.props.userInfo.displayName}
            subtitle={this.props.userInfo.username}
            avatar={this.props.userInfo.avatarUrl || '/images/no-image.gif'}
          />
          <Divider />
          <CardText>
            Current Balance: ${this.props.balance}
          </CardText>
        </Card>
    );
  }
}

export default MiniProfile;
