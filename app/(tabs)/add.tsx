import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/Design';
import { Calendar, ChevronRight, Plus } from 'lucide-react-native';
import { CATEGORIES } from '../../constants/MockData';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useRouter } from 'expo-router';

export default function AddExpenseScreen() {
    const theme = Colors.dark;
    const router = useRouter();
    const addTransaction = useStore((state) => state.addTransaction);

    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');

    const handleSave = () => {
        const numAmount = parseFloat(amount.replace(',', '.'));
        if (isNaN(numAmount) || numAmount <= 0) return;

        addTransaction({
            title: title || (type === 'expense' ? 'Spesa' : 'Entrata'),
            amount: type === 'expense' ? -numAmount : numAmount,
            categoryId: selectedCategory,
            date: new Date().toLocaleDateString('it-IT'),
            type: type,
        });

        router.replace('/(tabs)');
    };

    const filteredCategories = CATEGORIES.filter(cat =>
        cat.type === type || cat.type === 'both'
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.typeToggle}>
                <TouchableOpacity
                    onPress={() => {
                        setType('expense');
                        setSelectedCategory(CATEGORIES[0].id);
                    }}
                    style={[styles.typeButton, type === 'expense' && { backgroundColor: theme.danger + '20', borderColor: theme.danger }]}>
                    <Text style={[styles.typeText, { color: type === 'expense' ? theme.danger : theme.textMuted }]}>Uscita</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setType('income');
                        setSelectedCategory('9'); // Default to Stipendio
                    }}
                    style={[styles.typeButton, type === 'income' && { backgroundColor: theme.success + '20', borderColor: theme.success }]}>
                    <Text style={[styles.typeText, { color: type === 'income' ? theme.success : theme.textMuted }]}>Entrata</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.amountContainer}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Importo {type === 'expense' ? 'Spesa' : 'Entrata'}</Text>
                <View style={styles.inputWrapper}>
                    <Text style={[styles.currency, { color: type === 'expense' ? theme.danger : theme.success }]}>€</Text>
                    <TextInput
                        style={[styles.amountInput, { color: theme.text }]}
                        placeholder="0,00"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        autoFocus
                    />
                </View>
            </View>

            <View style={styles.form}>
                <Text style={[styles.formLabel, { color: theme.textMuted }]}>Descrizione (Opzionale)</Text>
                <TextInput
                    style={[styles.titleInput, { backgroundColor: theme.card, color: theme.text }]}
                    placeholder="E es. Spesa lavoro, Stipendio..."
                    placeholderTextColor={theme.textMuted}
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={[styles.formLabel, { color: theme.textMuted }]}>Categoria</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                    {filteredCategories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => setSelectedCategory(cat.id)}
                            style={[
                                styles.categoryCard,
                                { backgroundColor: theme.card },
                                selectedCategory === cat.id && { borderColor: cat.color, borderWidth: 2 }
                            ]}>
                            <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                                <cat.icon color={cat.color} size={20} />
                            </View>
                            <Text style={[styles.categoryName, { color: theme.text }]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity style={[styles.submitButton, { backgroundColor: type === 'expense' ? theme.primary : theme.success }]} onPress={handleSave}>
                    <Text style={styles.submitButtonText}>Salva {type === 'expense' ? 'Spesa' : 'Entrata'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    typeToggle: {
        flexDirection: 'row',
        padding: Spacing.md,
        gap: Spacing.md,
        justifyContent: 'center',
        marginTop: Spacing.md,
    },
    typeButton: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.round,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    typeText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    amountContainer: {
        paddingVertical: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    currency: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    amountInput: {
        fontSize: 56,
        fontWeight: 'bold',
        minWidth: 120,
        textAlign: 'center',
    },
    form: {
        paddingHorizontal: Spacing.md,
        gap: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    formLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginLeft: 4,
        marginTop: Spacing.sm,
    },
    titleInput: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        fontSize: 16,
    },
    categoryList: {
        gap: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    categoryCard: {
        width: 100,
        height: 100,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
    },
    categoryIcon: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryName: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    submitButton: {
        marginTop: Spacing.lg,
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
