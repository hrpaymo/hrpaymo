import React from 'react';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import moment from 'moment';

const style = {
  card: {
    position: 'relative',
    width: '100%',
    display: 'inline-block',
  },
  title: {
    fontWeight: 700,
    fontSize: '20px',
    margin: '10px'
  }
};

class ProfileHeader extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <Paper className='feed-container'>
        <Card>
          <CardHeader
            title={
              <div>
                <span style={style.title}>{this.props.profileInfo.fullName}</span>
                <span> ({this.props.profileInfo.username})</span>
              </div>
            }
            subtitle={
              <div className='member-tag'>
                Member since : {moment(this.props.profileInfo.createdAt).format('MMMM Do YYYY')}
              </div>
            }
            avatar={
              <Avatar 
                size={100} 
                src={this.props.profileInfo.avatarUrl || '/images/no-image.gif'}
              />
            }
            />
        </Card>
      </Paper>
    );
  }
}

export default ProfileHeader;
