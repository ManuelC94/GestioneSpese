import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import { Home, PlusCircle, History } from 'lucide-react-native';
import { Colors } from '../../constants/Design';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
    const theme = Colors.dark;
    const insets = useSafeAreaInsets();

    return (
        <MaterialTopTabs
            tabBarPosition="bottom"
            screenOptions={{
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textMuted,
                tabBarIndicatorStyle: {
                    backgroundColor: 'transparent', // Remove the top indicator
                },
                tabBarStyle: {
                    backgroundColor: theme.card,
                    borderTopColor: theme.border,
                    borderTopWidth: 1,
                    height: 65 + (insets.bottom > 0 ? insets.bottom : 10),
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
                    paddingTop: 8,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '700',
                    textTransform: 'none',
                    marginBottom: 5,
                },
                tabBarShowIcon: true,
                tabBarPressColor: theme.primary + '20',
                lazy: true,
                swipeEnabled: true,
            }}>
            <MaterialTopTabs.Screen
                name="index"
                options={{
                    title: 'Bilancio',
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <Home size={22} color={color} />,
                }}
            />
            <MaterialTopTabs.Screen
                name="add"
                options={{
                    title: 'Nuova Spesa',
                    tabBarLabel: 'Aggiungi',
                    tabBarIcon: ({ color }) => <PlusCircle size={22} color={color} />,
                }}
            />
            <MaterialTopTabs.Screen
                name="history"
                options={{
                    title: 'Storico',
                    tabBarLabel: 'Storico',
                    tabBarIcon: ({ color }) => <History size={22} color={color} />,
                }}
            />
        </MaterialTopTabs>
    );
}
