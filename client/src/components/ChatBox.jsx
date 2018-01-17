import React from 'react';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

class ChatBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <List>
              {
                    this.props.chats && this.props.chats.length &&
                    this.props.chats.map((chat, index) => {
                        return (
                            <ListItem 
                              key={index} 
                              id={index}
                              className="single-chat"
                              leftAvatar={<Avatar src={ chat.user === this.props.friend.first_name ? this.props.friend.avatar_url : this.props.uiAvatar} />}
                              primaryText={chat.text}
                              secondaryText={chat.time}
                            />
                        );
                    })
              }
          </List>
        );
    }
};

export default ChatBox;