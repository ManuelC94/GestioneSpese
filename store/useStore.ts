import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    clearTransactions: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            transactions: [],
            addTransaction: (transaction) => {
                const newTransaction = {
                    ...transaction,
                    id: Math.random().toString(36).substring(2, 9),
                };
                set((state) => ({
                    transactions: [newTransaction, ...state.transactions],
                }));
            },
            deleteTransaction: (id) => {
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                }));
            },
            clearTransactions: () => set({ transactions: [] }),
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

    const totals = transactions.reduce(
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
