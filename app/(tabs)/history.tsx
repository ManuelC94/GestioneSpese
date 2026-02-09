import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/Design';
import { Filter, ChevronDown, BarChart3, PieChart, Inbox, Search, X, Trash2, Edit2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { useStore, parseITDate, getIcon, Transaction } from '../../store/useStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const theme = Colors.dark;
    const insets = useSafeAreaInsets();
    const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Modal state
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editAmount, setEditAmount] = useState('');

    const transactions = useStore((state) => state.transactions);
    const categories = useStore((state) => state.categories);
    const updateTransaction = useStore((state) => state.updateTransaction);
    const deleteTransaction = useStore((state) => state.deleteTransaction);

    const changeDate = (direction: -1 | 1) => {
        const newDate = new Date(selectedDate);
        if (viewMode === 'monthly') {
            newDate.setMonth(newDate.getMonth() + direction);
        } else {
            newDate.setFullYear(newDate.getFullYear() + direction);
        }
        setSelectedDate(newDate);
    };

    const periodLabel = viewMode === 'monthly'
        ? selectedDate.toLocaleString('it-IT', { month: 'long', year: 'numeric' })
        : selectedDate.getFullYear().toString();

    const filteredTransactions = transactions.filter(t => {
        const d = parseITDate(t.date);
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCatId ? t.categoryId === selectedCatId : true;

        let matchesTime = false;
        if (viewMode === 'monthly') {
            matchesTime = d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
        } else {
            matchesTime = d.getFullYear() === selectedDate.getFullYear();
        }

        return matchesSearch && matchesCategory && matchesTime;
    });

    const groupedByCategory = categories.map(cat => {
        const total = filteredTransactions
            .filter(t => t.categoryId === cat.id && t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return { ...cat, total };
    }).filter(c => c.total > 0 && c.id !== '10').sort((a, b) => b.total - a.total);

    const totalSpent = groupedByCategory.reduce((sum, c) => sum + c.total, 0);

    const savingsTotal = filteredTransactions
        .filter(t => t.categoryId === '10')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const handleOpenEdit = (t: Transaction) => {
        setEditingTransaction(t);
        setEditTitle(t.title);
        setEditAmount(Math.abs(t.amount).toString());
        setEditModalVisible(true);
    };

    const handleSaveEdit = () => {
        if (!editingTransaction) return;
        const numAmount = parseFloat(editAmount.replace(',', '.'));
        if (isNaN(numAmount)) return;

        updateTransaction({
            ...editingTransaction,
            title: editTitle,
            amount: editingTransaction.amount > 0 ? numAmount : -numAmount
        });
        setEditModalVisible(false);
    };

    const handleDelete = () => {
        if (!editingTransaction) return;
        Alert.alert(
            "Elimina Transazione",
            "Sei sicuro di voler eliminare questa operazione?",
            [
                { text: "Annulla", style: "cancel" },
                {
                    text: "Elimina",
                    style: "destructive",
                    onPress: () => {
                        deleteTransaction(editingTransaction.id);
                        setEditModalVisible(false);
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { marginTop: insets.top + Spacing.md }]}>
                <View style={styles.dateNav}>
                    <TouchableOpacity onPress={() => changeDate(-1)} style={styles.navButton}>
                        <ChevronLeft color={theme.text} size={24} />
                    </TouchableOpacity>
                    <Text style={[styles.navDate, { color: theme.text }]}>{periodLabel}</Text>
                    <TouchableOpacity onPress={() => changeDate(1)} style={styles.navButton}>
                        <ChevronRight color={theme.text} size={24} />
                    </TouchableOpacity>
                </View>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        onPress={() => setViewMode('monthly')}
                        style={[styles.toggleButton, viewMode === 'monthly' && { backgroundColor: theme.primary }]}>
                        <Text style={[styles.toggleText, { color: viewMode === 'monthly' ? 'white' : theme.textMuted }]}>M</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setViewMode('annual')}
                        style={[styles.toggleButton, viewMode === 'annual' && { backgroundColor: theme.primary }]}>
                        <Text style={[styles.toggleText, { color: viewMode === 'annual' ? 'white' : theme.textMuted }]}>A</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchSection}>
                <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
                    <Search color={theme.textMuted} size={18} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Cerca transazioni..."
                        placeholderTextColor={theme.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X color={theme.textMuted} size={18} />
                        </TouchableOpacity>
                    )}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catFilter}>
                    <TouchableOpacity
                        onPress={() => setSelectedCatId(null)}
                        style={[styles.catFilterBtn, !selectedCatId && { backgroundColor: theme.primary + '20', borderColor: theme.primary }]}>
                        <Text style={[styles.catFilterText, { color: !selectedCatId ? theme.primary : theme.textMuted }]}>Tutte</Text>
                    </TouchableOpacity>
                    {categories.map(cat => (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => setSelectedCatId(cat.id)}
                            style={[
                                styles.catFilterBtn,
                                selectedCatId === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color }
                            ]}>
                            <Text style={[styles.catFilterText, { color: selectedCatId === cat.id ? cat.color : theme.textMuted }]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.scroll}>
                <View style={styles.summarySection}>
                    <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                        <View>
                            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Spese {periodLabel}</Text>
                            <Text style={[styles.summaryValue, { color: theme.text }]}>€ {totalSpent.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</Text>
                        </View>
                        <BarChart3 color={theme.primary} size={32} />
                    </View>

                    <View style={[styles.summaryCard, { backgroundColor: theme.card, marginTop: Spacing.sm }]}>
                        <View>
                            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Risparmiati {periodLabel}</Text>
                            <Text style={[styles.summaryValue, { color: theme.warning }]}>€ {savingsTotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</Text>
                        </View>
                        <PieChart color={theme.warning} size={32} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Analisi per Categoria</Text>
                    {groupedByCategory.length === 0 ? (
                        <Text style={[styles.emptySectionText, { color: theme.textMuted }]}>Nessun dato di spesa disponibile.</Text>
                    ) : (
                        groupedByCategory.map((cat) => {
                            const CategoryIcon = getIcon(cat.iconName);
                            return (
                                <View key={cat.id} style={styles.categoryItem}>
                                    <View style={styles.categoryHeader}>
                                        <View style={[styles.iconBox, { backgroundColor: cat.color + '20' }]}>
                                            <CategoryIcon color={cat.color} size={18} />
                                        </View>
                                        <Text style={[styles.categoryName, { color: theme.text }]}>{cat.name}</Text>
                                        <Text style={[styles.categoryTotal, { color: theme.text }]}>€ {cat.total.toLocaleString('it-IT')}</Text>
                                    </View>
                                    <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                                        <View
                                            style={[
                                                styles.progressBarFill,
                                                { backgroundColor: cat.color, width: `${(cat.total / totalSpent) * 100}%` }
                                            ]}
                                        />
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Dettaglio Transazioni</Text>
                    {filteredTransactions.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Inbox color={theme.textMuted} size={48} />
                            <Text style={[styles.emptyText, { color: theme.textMuted }]}>Nessuna transazione trovata.</Text>
                        </View>
                    ) : (
                        filteredTransactions.map((t) => {
                            const cat = categories.find(c => c.id === t.categoryId);
                            const Icon = getIcon(cat?.iconName || 'Wallet');
                            return (
                                <TouchableOpacity
                                    key={t.id}
                                    onPress={() => handleOpenEdit(t)}
                                    style={[styles.transactionItem, { borderBottomColor: theme.border }]}>
                                    <View style={styles.transactionInfo}>
                                        <Text style={[styles.transactionTitle, { color: theme.text }]}>{t.title}</Text>
                                        <Text style={[styles.transactionDate, { color: theme.textMuted }]}>{t.date} • {cat?.name}</Text>
                                    </View>
                                    <Text style={[styles.transactionAmount, { color: t.amount > 0 ? theme.success : theme.danger }]}>
                                        {t.amount > 0 ? '+' : ''} € {Math.abs(t.amount).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            <Modal visible={editModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Dettaglio Transazione</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <X color={theme.textMuted} size={24} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.editForm}>
                            <Text style={[styles.editLabel, { color: theme.textMuted }]}>Titolo</Text>
                            <TextInput
                                style={[styles.editInput, { backgroundColor: theme.background, color: theme.text }]}
                                value={editTitle}
                                onChangeText={setEditTitle}
                            />

                            <Text style={[styles.editLabel, { color: theme.textMuted }]}>Importo (€)</Text>
                            <TextInput
                                style={[styles.editInput, { backgroundColor: theme.background, color: theme.text }]}
                                value={editAmount}
                                onChangeText={setEditAmount}
                                keyboardType="numeric"
                            />

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    style={[styles.deleteBtn, { borderColor: theme.danger }]}>
                                    <Trash2 color={theme.danger} size={20} />
                                    <Text style={[styles.deleteText, { color: theme.danger }]}>Elimina</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSaveEdit}
                                    style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
                                    <Text style={styles.saveText}>Salva Modifiche</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        padding: Spacing.md,
        gap: Spacing.md,
        alignItems: 'center',
    },
    toggleContainer: {
        width: 80,
        flexDirection: 'row',
        backgroundColor: '#1E293B',
        borderRadius: BorderRadius.md,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: BorderRadius.sm,
    },
    toggleText: { fontSize: 14, fontWeight: 'bold' },
    iconButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.md,
    },
    searchSection: {
        paddingHorizontal: Spacing.md,
        gap: Spacing.sm,
        paddingBottom: Spacing.sm,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.lg,
        height: 48,
        gap: Spacing.sm,
    },
    searchInput: { flex: 1, fontSize: 15 },
    catFilter: { paddingVertical: 4 },
    catFilterBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: BorderRadius.round,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    catFilterText: { fontSize: 13, fontWeight: '600' },
    scroll: { flex: 1 },
    summarySection: { padding: Spacing.md },
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
    },
    summaryLabel: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
    summaryValue: { fontSize: 24, fontWeight: 'bold' },
    section: { padding: Spacing.md, marginBottom: Spacing.lg },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: Spacing.md },
    categoryItem: { marginBottom: Spacing.md },
    categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    iconBox: { width: 32, height: 32, borderRadius: BorderRadius.sm, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    categoryName: { flex: 1, fontSize: 15, fontWeight: '600' },
    categoryTotal: { fontSize: 15, fontWeight: 'bold' },
    progressBarBg: { height: 6, borderRadius: 3, width: '100%' },
    progressBarFill: { height: 6, borderRadius: 3 },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
    },
    transactionInfo: { flex: 1 },
    transactionTitle: { fontSize: 16, fontWeight: '500' },
    transactionDate: { fontSize: 12, marginTop: 2 },
    transactionAmount: { fontSize: 16, fontWeight: 'bold' },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.xl, gap: Spacing.md },
    emptyText: { textAlign: 'center', fontSize: 14, lineHeight: 20 },
    emptySectionText: { fontSize: 14, textAlign: 'center', paddingVertical: Spacing.md },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        padding: Spacing.lg,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    editForm: { gap: Spacing.md },
    editLabel: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    editInput: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        fontSize: 16,
    },
    modalActions: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.md,
    },
    deleteBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        gap: 8,
    },
    deleteText: { fontWeight: 'bold' },
    saveBtn: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    dateNav: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: Spacing.md,
    },
    navButton: {
        padding: 4,
    },
    navDate: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
});
