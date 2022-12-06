import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import 'react-native-gesture-handler';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

// Import functions from SDKs
const firebase = require('firebase');
require('firebase/firestore')


export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: '',
                avatar: '',
                name: '',
            }
        };

        //Set up Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyDaCR0OwT_Hf2WRj4PUabCi4iEghnJ-bS8",
            authDomain: "chatapp-30e5d.firebaseapp.com",
            projectId: "chatapp-30e5d",
            storageBucket: "chatapp-30e5d.appspot.com",
            messagingSenderId: "57490362557",
            appId: "1:57490362557:web:86d86546131560106e27d4"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.referenceChatMessages = firebase.firestore().collection('messages');
    }

    //Retrieve collection data & store in messages
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // Go through each document
        querySnapshot.forEach((doc) => {
            // Get QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar,
                },
            });
        });
        this.setState({
            messages,
        });
    };


    componentDidMount() {

        //Display username in navigation
        let { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });

        //Anonymous user authentication 
        this.referenceChatMessages = firebase.firestore().collection('messages');


        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                },
            });
            this.unsubscribe = this.referenceChatMessages
                .orderBy('createdAt', 'desc')
                .onSnapshot(this.onCollectionUpdate);
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.authUnsubscribe();
    }


    //Appends new message to previous  
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }), () => {
            this.addMessages(this.state.messages[0]);
        });
    }

    //Save messages to database
    addMessages = (message) => {

        this.referenceChatMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: message.user,
        });
    }

    //Allows bubble customization   
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={styles.bubble}
            />
        )
    }

    render() {
        const { color, name } = this.props.route.params;

        return (
            <View style={[{ backgroundColor: color }, styles.container]}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.user._id,
                        name: name,
                    }}
                />
                {/*Prevent hidden input field on Android*/}
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chatTitle: {
        color: '#FFFFFF'
    },
    bubble: {
        left: {
            backgroundColor: 'white',
        },
        right: {
            backgroundColor: 'blue'
        }
    }
})