import React from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import ChatWindow from './ChatWindow.jsx';

class ContactsList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            friends: []
        }
    }
    
    render() {
        const friends = [
            { name: 'Will Putnam', avatar: 'https://www.catersnews.com/wp-content/uploads/2015/12/3_CATERS_HOT_SELFIE_04-800x498.jpg' },
            { name: 'Albie Wong', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOl9VspK8J7QwkSwgpNFLJUXqXqI6hdNlsZwP0-8BfyrQIJP5N' },
            { name: 'Larry Chang', avatar: ' https://i.pinimg.com/originals/5f/81/a4/5f81a4c1175fff5ca594ce4219487ca8.jpg' }
        ]
        return (
            <div>
                <List>
                <Subheader>Friends</Subheader>
                {
                    friends.map((friend, i) => {
                        return <ChatWindow key={i} user={friend}/>;
                    })
                }
                </List>
            </div>
        );
    }
};

export default ContactsList;