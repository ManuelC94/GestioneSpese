import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Icons from 'lucide-react-native';

export interface Category {
    id: string;
    name: string;
    iconName: string; // Store as string for persistence
    color: string;
    type: 'expense' | 'income' | 'both';
}

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    categoryId: string;
    date: string;
    type: 'expense' | 'income';
}

interface AppState {
    transactions: Transaction[];
    categories: Category[];
    monthlyLimit: number;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    updateTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: string) => void;
    clearTransactions: () => void;
    addCategory: (category: Omit<Category, 'id'>) => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (id: string) => void;
    setMonthlyLimit: (limit: number) => void;
    resetCategories: () => void;
}

// Icon mapping helper
export const getIcon = (name: string) => {
    const Icon = (Icons as any)[name] || Icons.Wallet;
    return Icon;
};

const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'Pranzo/Cena', iconName: 'Utensils', color: '#F87171', type: 'expense' },
    { id: '2', name: 'Shopping', iconName: 'ShoppingBag', color: '#818CF8', type: 'expense' },
    { id: '3', name: 'Trasporti', iconName: 'Car', color: '#34D399', type: 'expense' },
    { id: '4', name: 'Netflix/Svago', iconName: 'Tv', color: '#FBBF24', type: 'expense' },
    { id: '5', name: 'Palestra', iconName: 'Dumbbell', color: '#A78BFA', type: 'expense' },
    { id: '6', name: 'Salute', iconName: 'HeartPulse', color: '#F472B6', type: 'expense' },
    { id: '7', name: 'Formazione', iconName: 'GraduationCap', color: '#60A5FA', type: 'expense' },
    { id: '9', name: 'Stipendio', iconName: 'Wallet', color: '#10B981', type: 'income' },
    { id: '8', name: 'Altro', iconName: 'Wallet', color: '#94A3B8', type: 'both' },
    { id: '10', name: 'Risparmio', iconName: 'PiggyBank', color: '#F59E0B', type: 'expense' },
];

// Helper to parse 'DD/MM/YYYY' into a comparable Date object
export const parseITDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            transactions: [],
            categories: DEFAULT_CATEGORIES,
            monthlyLimit: 1000, // Default limit
            addTransaction: (transaction) => {
                const newTransaction = {
                    ...transaction,
                    id: Math.random().toString(36).substring(2, 9),
                };
                set((state) => {
                    const newTransactions = [newTransaction, ...state.transactions].sort((a, b) =>
                        parseITDate(b.date).getTime() - parseITDate(a.date).getTime()
                    );
                    return { transactions: newTransactions };
                });
            },
            updateTransaction: (transaction) => {
                set((state) => {
                    const newTransactions = state.transactions
                        .map((t) => (t.id === transaction.id ? transaction : t))
                        .sort((a, b) => parseITDate(b.date).getTime() - parseITDate(a.date).getTime());
                    return { transactions: newTransactions };
                });
            },
            deleteTransaction: (id) => {
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                }));
            },
            clearTransactions: () => set({ transactions: [], categories: DEFAULT_CATEGORIES }),
            addCategory: (category) => {
                const newCategory = {
                    ...category,
                    id: Math.random().toString(36).substring(2, 9),
                };
                set((state) => ({
                    categories: [...state.categories, newCategory],
                }));
            },
            updateCategory: (category) => {
                set((state) => ({
                    categories: state.categories.map((c) => (c.id === category.id ? category : c)),
                }));
            },
            deleteCategory: (id) => {
                set((state) => ({
                    categories: state.categories.filter((c) => c.id !== id),
                    transactions: state.transactions.map(t =>
                        t.categoryId === id ? { ...t, categoryId: '8' } : t
                    )
                }));
            },
            setMonthlyLimit: (limit) => set({ monthlyLimit: limit }),
            resetCategories: () => set({ categories: DEFAULT_CATEGORIES }),
        }),
        {
            name: 'gestione-spese-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Helpers to calculate totals
export const useTotals = () => {
    const transactions = useStore((state) => state.transactions);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Inclusive of today

    const totals = transactions
        .filter(t => parseITDate(t.date) <= today)
        .reduce(
            (acc, t) => {
                if (t.type === 'income') {
                    acc.income += t.amount;
                } else if (t.categoryId === '10') {
                    acc.savings += Math.abs(t.amount);
                } else {
                    acc.expenses += Math.abs(t.amount);
                }
                return acc;
            },
            { income: 0, expenses: 0, savings: 0 }
        );

    return {
        ...totals,
        balance: totals.income - totals.expenses - totals.savings,
    };
};
