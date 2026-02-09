import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Modal } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/Design';
import { Calendar, ChevronRight, Plus, CheckCircle } from 'lucide-react-native';
import { useState } from 'react';
import { useStore, parseITDate, getIcon } from '../../store/useStore';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddExpenseScreen() {
    const theme = Colors.dark;
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const addTransaction = useStore((state) => state.addTransaction);
    const categories = useStore((state) => state.categories);

    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringMonths, setRecurringMonths] = useState('1');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        const numAmount = parseFloat(amount.replace(',', '.'));
        if (isNaN(numAmount) || numAmount <= 0) return;

        const baseTitle = title || (type === 'expense' ? 'Spesa' : 'Entrata');
        const months = isRecurring ? parseInt(recurringMonths) : 1;

        const now = new Date();

        for (let i = 0; i < months; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() + i, now.getDate());
            const dateStr = date.toLocaleDateString('it-IT');

            addTransaction({
                title: baseTitle + (isRecurring && months > 1 ? ` (${i + 1}/${months})` : ''),
                amount: type === 'expense' ? -numAmount : numAmount,
                categoryId: selectedCategory,
                date: dateStr,
                type: type,
            });
        }

        // Reset fields
        setAmount('');
        setTitle('');
        setIsRecurring(false);
        setRecurringMonths('1');

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            router.replace('/(tabs)');
        }, 1500);
    };

    const filteredCategories = categories.filter(cat =>
        cat.type === type || cat.type === 'both'
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.typeToggle, { marginTop: insets.top + Spacing.md }]}>
                <TouchableOpacity
                    onPress={() => {
                        setType('expense');
                        setSelectedCategory('1');
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
                    placeholder=""
                    placeholderTextColor={theme.textMuted}
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={[styles.formLabel, { color: theme.textMuted }]}>Categoria</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                    {filteredCategories.map((cat) => {
                        const CategoryIcon = getIcon(cat.iconName);
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setSelectedCategory(cat.id)}
                                style={[
                                    styles.categoryCard,
                                    { backgroundColor: theme.card },
                                    selectedCategory === cat.id && { borderColor: cat.color, borderWidth: 2 }
                                ]}>
                                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                                    <CategoryIcon color={cat.color} size={20} />
                                </View>
                                <Text style={[styles.categoryName, { color: theme.text }]}>{cat.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <View style={[styles.recurringContainer, { backgroundColor: theme.card }]}>
                    <View style={styles.recurringRow}>
                        <View>
                            <Text style={[styles.recurringTitle, { color: theme.text }]}>Costo Fisso / Ricorrente</Text>
                            <Text style={[styles.recurringSubtitle, { color: theme.textMuted }]}>Ripeti questa spesa nei prossimi mesi</Text>
                        </View>
                        <Switch
                            value={isRecurring}
                            onValueChange={setIsRecurring}
                            trackColor={{ false: theme.border, true: theme.primary }}
                            thumbColor="white"
                        />
                    </View>

                    {isRecurring && (
                        <View style={styles.monthsContainer}>
                            <Text style={[styles.monthsLabel, { color: theme.text }]}>Durata: {recurringMonths} mesi</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthsList}>
                                {['3', '6', '12', '24'].map((m) => (
                                    <TouchableOpacity
                                        key={m}
                                        onPress={() => setRecurringMonths(m)}
                                        style={[
                                            styles.monthButton,
                                            { backgroundColor: theme.background, borderColor: theme.border },
                                            recurringMonths === m && { borderColor: theme.primary, borderWidth: 1 }
                                        ]}>
                                        <Text style={[styles.monthText, { color: recurringMonths === m ? theme.primary : theme.text }]}>{m}</Text>
                                    </TouchableOpacity>
                                ))}
                                <TextInput
                                    style={[styles.customMonthInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                                    placeholder="Altro..."
                                    placeholderTextColor={theme.textMuted}
                                    keyboardType="numeric"
                                    onChangeText={setRecurringMonths}
                                />
                            </ScrollView>
                        </View>
                    )}
                </View>

                <TouchableOpacity style={[styles.submitButton, { backgroundColor: type === 'expense' ? theme.primary : theme.success }]} onPress={handleSave}>
                    <Text style={styles.submitButtonText}>Salva {type === 'expense' ? 'Spesa' : 'Entrata'}</Text>
                </TouchableOpacity>
            </View>

            <Modal transparent visible={showSuccess} animationType="fade">
                <View style={styles.successOverlay}>
                    <View style={[styles.successContent, { backgroundColor: theme.card }]}>
                        <CheckCircle color={theme.success} size={64} />
                        <Text style={[styles.successText, { color: theme.text }]}>Operazione Completata!</Text>
                        <Text style={[styles.successSub, { color: theme.textMuted }]}>La tua transazione è stata salvata.</Text>
                    </View>
                </View>
            </Modal>
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
        marginTop: Spacing.sm,
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
    recurringContainer: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginTop: Spacing.sm,
        gap: Spacing.md,
    },
    recurringRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    recurringTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    recurringSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    monthsContainer: {
        gap: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingTop: Spacing.md,
    },
    monthsLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    monthsList: {
        gap: Spacing.sm,
        paddingBottom: 4,
    },
    monthButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        minWidth: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthText: {
        fontWeight: 'bold',
    },
    customMonthInput: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        width: 80,
    },
    successOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successContent: {
        padding: Spacing.xl,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        gap: Spacing.md,
    },
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: Spacing.sm,
    },
    successSub: {
        fontSize: 14,
    },
});
