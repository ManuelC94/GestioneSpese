import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/Design';
import { Filter, ChevronDown, BarChart3, PieChart, Inbox } from 'lucide-react-native';
import { CATEGORIES } from '../../constants/MockData';
import { useState } from 'react';
import { useStore } from '../../store/useStore';

export default function HistoryScreen() {
    const theme = Colors.dark;
    const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');
    const transactions = useStore((state) => state.transactions);

    const groupedByCategory = CATEGORIES.map(cat => {
        const total = transactions
            .filter(t => t.categoryId === cat.id && t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return { ...cat, total };
    }).filter(c => c.total > 0 && c.id !== '10').sort((a, b) => b.total - a.total);

    const totalSpent = groupedByCategory.reduce((sum, c) => sum + c.total, 0);

    const savingsTotal = transactions
        .filter(t => t.categoryId === '10')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const currentMonthName = new Date().toLocaleString('it-IT', { month: 'long' });

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        onPress={() => setViewMode('monthly')}
                        style={[styles.toggleButton, viewMode === 'monthly' && { backgroundColor: theme.primary }]}>
                        <Text style={[styles.toggleText, { color: viewMode === 'monthly' ? 'white' : theme.textMuted }]}>Mensile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setViewMode('annual')}
                        style={[styles.toggleButton, viewMode === 'annual' && { backgroundColor: theme.primary }]}>
                        <Text style={[styles.toggleText, { color: viewMode === 'annual' ? 'white' : theme.textMuted }]}>Annuale</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card }]}>
                    <Filter color={theme.text} size={20} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll}>
                <View style={styles.summarySection}>
                    <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                        <View>
                            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Spese Reali {viewMode === 'monthly' ? currentMonthName : '2026'}</Text>
                            <Text style={[styles.summaryValue, { color: theme.text }]}>€ {totalSpent.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</Text>
                        </View>
                        <BarChart3 color={theme.primary} size={32} />
                    </View>

                    <View style={[styles.summaryCard, { backgroundColor: theme.card, marginTop: Spacing.sm }]}>
                        <View>
                            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Risparmiati {viewMode === 'monthly' ? currentMonthName : '2026'}</Text>
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
                        groupedByCategory.map((cat) => (
                            <View key={cat.id} style={styles.categoryItem}>
                                <View style={styles.categoryHeader}>
                                    <View style={[styles.iconBox, { backgroundColor: cat.color + '20' }]}>
                                        <cat.icon color={cat.color} size={18} />
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
                        ))
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Dettaglio Transazioni</Text>
                    {transactions.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Inbox color={theme.textMuted} size={48} />
                            <Text style={[styles.emptyText, { color: theme.textMuted }]}>Nessuna transazione trovata.</Text>
                        </View>
                    ) : (
                        transactions.map((t) => {
                            const cat = CATEGORIES.find(c => c.id === t.categoryId);
                            return (
                                <View key={t.id} style={[styles.transactionItem, { borderBottomColor: theme.border }]}>
                                    <View style={styles.transactionInfo}>
                                        <Text style={[styles.transactionTitle, { color: theme.text }]}>{t.title}</Text>
                                        <Text style={[styles.transactionDate, { color: theme.textMuted }]}>{t.date} • {cat?.name}</Text>
                                    </View>
                                    <Text style={[styles.transactionAmount, { color: t.amount > 0 ? theme.success : theme.danger }]}>
                                        {t.amount > 0 ? '+' : ''} € {Math.abs(t.amount).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                    </Text>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        padding: Spacing.md,
        gap: Spacing.md,
        alignItems: 'center',
    },
    toggleContainer: {
        flex: 1,
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
    toggleText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    iconButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.md,
    },
    scroll: {
        flex: 1,
    },
    summarySection: {
        padding: Spacing.md,
    },
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        padding: Spacing.md,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: Spacing.md,
    },
    categoryItem: {
        marginBottom: Spacing.md,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    categoryName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
    },
    categoryTotal: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    emptySectionText: {
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: Spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xl,
        gap: Spacing.md,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    },
    progressBarBg: {
        height: 6,
        borderRadius: 3,
        width: '100%',
    },
    progressBarFill: {
        height: 6,
        borderRadius: 3,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    transactionDate: {
        fontSize: 12,
        marginTop: 2,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
