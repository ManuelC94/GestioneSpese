import { Tabs } from 'expo-router';
import { Home, PlusCircle, History } from 'lucide-react-native';
import { Colors } from '../../constants/Design';

export default function TabLayout() {
    const theme = Colors.dark;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textMuted,
                tabBarStyle: {
                    backgroundColor: theme.card,
                    borderTopColor: theme.border,
                    height: 60,
                    paddingBottom: 8,
                },
                headerStyle: {
                    backgroundColor: theme.background,
                },
                headerTitleStyle: {
                    color: theme.text,
                    fontWeight: 'bold',
                },
                headerShadowVisible: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Bilancio',
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: 'Nuova Spesa',
                    tabBarLabel: 'Aggiungi',
                    tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Storico',
                    tabBarLabel: 'Storico',
                    tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
