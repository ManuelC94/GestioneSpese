import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/Design';
import { Wallet, ArrowDownCircle, ArrowUpCircle, PiggyBank, TrendingUp, Inbox } from 'lucide-react-native';
import { CATEGORIES } from '../../constants/MockData';
import { useStore, useTotals } from '../../store/useStore';

export default function DashboardScreen() {
    const theme = Colors.dark;
    const { balance, income, expenses, savings } = useTotals();
    const transactions = useStore((state) => state.transactions);

    const recentTransactions = transactions.slice(0, 5);
    const savingsPercentage = income > 0 ? ((savings / income) * 100).toFixed(0) : '0';

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.greeting, { color: theme.textMuted }]}>Bentornato, Manuel</Text>
                <Text style={[styles.title, { color: theme.text }]}>Il tuo Bilancio</Text>
            </View>

            <View style={[styles.mainCard, { backgroundColor: theme.primary }]}>
                <View style={styles.cardHeader}>
                    <Wallet color="white" size={24} />
                    <Text style={styles.cardTitle}>Saldo Attuale</Text>
                </View>
                <Text style={styles.balance}>€ {balance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.cardSubtitle}>Gestione Fondi</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
                    <ArrowUpCircle color={theme.success} size={20} />
                    <Text style={[styles.statsLabel, { color: theme.textMuted }]}>Entrate</Text>
                    <Text style={[styles.statsValue, { color: theme.success }]}>€ {income.toLocaleString('it-IT')}</Text>
                </View>
                <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
                    <ArrowDownCircle color={theme.danger} size={20} />
                    <Text style={[styles.statsLabel, { color: theme.textMuted }]}>Spese Reali</Text>
                    <Text style={[styles.statsValue, { color: theme.danger }]}>€ {expenses.toLocaleString('it-IT')}</Text>
                </View>
            </View>

            <View style={[styles.savingsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.savingsIconBox}>
                    <PiggyBank color={theme.warning} size={24} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.statsLabel, { color: theme.textMuted }]}>Risparmiati</Text>
                    <Text style={[styles.savingsValue, { color: theme.text }]}>€ {savings.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</Text>
                </View>
                <View style={styles.badge}>
                    <TrendingUp color={theme.success} size={14} />
                    <Text style={[styles.badgeText, { color: theme.success }]}>{savingsPercentage}%</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Transazioni Recenti</Text>
                {recentTransactions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Inbox color={theme.textMuted} size={48} />
                        <Text style={[styles.emptyText, { color: theme.textMuted }]}>Nessuna transazione ancora. Inizia ad aggiungere le tue spese!</Text>
                    </View>
                ) : (
                    recentTransactions.map((item) => {
                        const category = CATEGORIES.find(c => c.id === item.categoryId);
                        const Icon = category?.icon || Wallet;
                        return (
                            <View key={item.id} style={[styles.listItem, { backgroundColor: theme.card }]}>
                                <View style={[styles.iconBox, { backgroundColor: (category?.color || theme.border) + '20' }]}>
                                    <Icon color={category?.color || theme.text} size={20} />
                                </View>
                                <View style={styles.listItemContent}>
                                    <Text style={[styles.listItemTitle, { color: theme.text }]}>{item.title}</Text>
                                    <Text style={[styles.listItemDate, { color: theme.textMuted }]}>{item.date}</Text>
                                </View>
                                <Text style={[styles.listItemAmount, { color: item.amount > 0 ? theme.success : theme.danger }]}>
                                    {item.amount > 0 ? '+' : ''} € {Math.abs(item.amount).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                </Text>
                            </View>
                        );
                    })
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.md,
    },
    header: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    greeting: {
        fontSize: 14,
        fontWeight: '500',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    mainCard: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.lg,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    cardTitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        fontWeight: '600',
    },
    balance: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: Spacing.sm,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        paddingTop: Spacing.sm,
    },
    cardSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    statsCard: {
        flex: 1,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        gap: Spacing.xs,
    },
    statsLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    statsValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    savingsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.xl,
        gap: Spacing.md,
    },
    savingsIconBox: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.round,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    savingsValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
        gap: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: Spacing.md,
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
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
        gap: Spacing.md,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItemContent: {
        flex: 1,
    },
    listItemTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    listItemDate: {
        fontSize: 12,
    },
    listItemAmount: {
        fontSize: 16,
        fontWeight: '700',
    },
});
