import { Utensils, ShoppingBag, Car, Tv, Dumbbell, Wallet, HeartPulse, GraduationCap, PiggyBank } from 'lucide-react-native';

export const CATEGORIES = [
    { id: '1', name: 'Pranzo/Cena', icon: Utensils, color: '#F87171', type: 'expense' },
    { id: '2', name: 'Shopping', icon: ShoppingBag, color: '#818CF8', type: 'expense' },
    { id: '3', name: 'Trasporti', icon: Car, color: '#34D399', type: 'expense' },
    { id: '4', name: 'Netflix/Svago', icon: Tv, color: '#FBBF24', type: 'expense' },
    { id: '5', name: 'Palestra', icon: Dumbbell, color: '#A78BFA', type: 'expense' },
    { id: '6', name: 'Salute', icon: HeartPulse, color: '#F472B6', type: 'expense' },
    { id: '7', name: 'Formazione', icon: GraduationCap, color: '#60A5FA', type: 'expense' },
    { id: '8', name: 'Altro', icon: Wallet, color: '#94A3B8', type: 'both' },
    { id: '9', name: 'Stipendio', icon: Wallet, color: '#10B981', type: 'income' },
    { id: '10', name: 'Risparmio', icon: PiggyBank, color: '#F59E0B', type: 'expense' },
];

// No more MOCK_TRANSACTIONS or SUMMARY - using useStore instead
