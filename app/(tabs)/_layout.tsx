import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'AR Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cube" color={color} />,
        }}
      />
      <Tabs.Screen
        name="magnifier"
        options={{
          title: 'Magnifier',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} />,
        }}
      />
    </Tabs>
  );
}
