import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ChatMessagesList from './ChatMessagesList.jsx';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

export default class ChatWindow extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            chats: []
        };
        this.handleClose = this.handleClose.bind(this);
    }

      handleOpen() {
        this.setState({open: true});    
      };
    
      handleClose() {
        this.setState({open: false});
      };

    render(){

        const actions = [
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleClose}
            />,
            <FlatButton
              label="Send"
              primary={true}
              disabled={true}
              onClick={this.handleClose.bind(this)}
            />,
          ];

        return (
            <div className='chat-box-window'>
                <ListItem
                    primaryText={this.props.user.name}
                    leftAvatar={<Avatar src={this.props.user.avatar} />}
                    rightIcon={<CommunicationChatBubble />}
                    onClick={this.handleOpen.bind(this)}
                />
                <Divider inset={true} />
                <Dialog
                  className="chat-modal"
                  title="Chat with..." 
                  actions={actions}
                  open={this.state.open}
                  actions={actions}
                  modal={false}
                  onRequestClose={this.handleClose}
                >
                </Dialog>
            </div>
        );
    }
}
