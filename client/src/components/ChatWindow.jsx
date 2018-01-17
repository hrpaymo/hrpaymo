import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ChatMessagesList from './ChatMessagesList.jsx';
import ChatBox from './ChatBox.jsx';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

export default class ChatWindow extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            messageInput: {
                username: 'you',
                time: 'just now',
                text: ''
            },
            chats: [
                { user: this.props.friend.first_name, text: 'hey man', time: 'just now' },
                { user: this.props.friend.first_name, text: 'you there?', time: 'just now' },
                { user: 'you', text: 'yeah', time: 'just now' }
            ]
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleInputChanges = this.handleInputChanges.bind(this);
        this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
    }


    scrollToBottom() {
        setTimeout(() => {
            let maxIndex = this.state.chats.length - 1;
            document.getElementById(maxIndex).scrollIntoView()
        }, 0);
    }

      handleOpen() {
        this.setState({open: true});   
        this.scrollToBottom();
      };
    
      handleClose() {
        this.setState({open: false});
      };

    handleInputChanges(event) {
        const { messageInput } = this.state;
        messageInput.text = event.target.value;
        this.setState({ messageInput });
    }

    handleEnterKeyPress(event) {
        if (event.key == 'Enter') {
            const { chats, messageInput } = this.state;
            this.setState({ 
                chats: [ ...chats, messageInput],
                messageInput: {
                    username: 'you',
                    time: 'just now',
                    text: ''
                }
            });
            this.scrollToBottom();
        }

    }

    render(){

        const friendName = this.props.friend.first_name + ' ' + this.props.friend.last_name;
        const modalTitle = `Chat with ${friendName}`;

        const actions = [
            <TextField
                value={this.state.messageInput.text}
                className="send-msg-box"
                hintText="Send a message"
                fullWidth={true}
                onChange={this.handleInputChanges}
                onKeyPress={this.handleEnterKeyPress}
            />,
            <FlatButton
              label="Close"
              primary={true}
              onClick={this.handleClose.bind(this)}
            />,
          ];

        const customContentStyle = {
            width: '50%',
            'max-height': '50%',
            'min-height': '50%'
        };

        return (
            
            <div className='chat-box-window'>
                <ListItem
                    primaryText={friendName}
                    leftAvatar={<Avatar src={this.props.friend.avatar_url} />}
                    rightIcon={<CommunicationChatBubble />}
                    onClick={this.handleOpen.bind(this)}
                />
                <Divider inset={true} />
                <Dialog
                  id="chat-modal"
                  title={modalTitle}
                  actions={actions}
                  open={this.state.open}
                  actions={actions}
                  modal={false}
                  onRequestClose={this.handleClose}
                  contentStyle={customContentStyle}
                  chats={this.state.chats} 
                  autoScrollBodyContent={true}
                >
                <ChatBox 
                  id="chat-box-area"
                  friend={this.props.friend} 
                  uiAvatar={this.props.uiAvatar}
                  chats={this.state.chats} 
                />
                </Dialog>
            </div>
        );
    }
}
