import React from 'react';
import { View, Text, Button } from 'react-native';

export default class Screen1 extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Hello Screen1!</Text>
                <Button
                    title='Go to Screen 2'
                    onPress={() => this.props.navigation.navigate('Screen2')}
                />
            </View>
        )
    }
}

        // apiKey: 'AIzaSyDaCR0OwT_Hf2WRj4PUabCi4iEghnJ-bS8',
        // authDomain: 'chatapp-30e5d.firebaseapp.com',
        // projectId: 'chatapp-30e5d',
        // storageBucket: 'chatapp-30e5d.appspot.com',
        // messagingSenderId: '57490362557',
        // appId: '1:57490362557:web:86d86546131560106e27d4',
        // measurementId: 'G-TKK1CVHTP7'