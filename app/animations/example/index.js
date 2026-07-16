import { Button, Pressable, View } from 'react-native';
import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

export default function App() {

    useFocusEffect(
        useCallback(() => {
            return () => { };
        }, [])
    );

    const size = useSharedValue(100);

    const handlePress = () => {
        size.value = withSpring(Math.random() * 100 + 50);
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
            <StatusBar
                barStyle="light-content"
                translucent
                backgroundColor="transparent"
            />

            <Pressable onPress={handlePress}>
                <Animated.View
                    style={{
                        width: size,
                        height: size,
                        backgroundColor: 'violet',
                        borderRadius: "100%"
                    }}
                />
            </Pressable>
        </View>
    );
}
