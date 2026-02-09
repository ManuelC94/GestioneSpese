import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/Design';
import { Wallet, ArrowDownCircle, ArrowUpCircle, PiggyBank, Settings, Inbox, TrendingUp } from 'lucide-react-native';
import { useStore, useTotals, parseITDate, getIcon } from '../../store/useStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
    const theme = Colors.dark;
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { balance, income, expenses, savings } = useTotals();
    const transactions = useStore((state) => state.transactions);
    const categories = useStore((state) => state.categories);
    const monthlyLimit = useStore((state) => state.monthlyLimit);

    const now = new Date();
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const currentMonthExpenses = transactions
        .filter(t => {
            const d = parseITDate(t.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'expense';
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const budgetProgress = Math.min(currentMonthExpenses / monthlyLimit, 1);
    const budgetColor = budgetProgress > 0.9 ? theme.danger : budgetProgress > 0.7 ? theme.warning : theme.success;

    const recentTransactions = transactions
        .filter(t => parseITDate(t.date) <= today)
        .slice(0, 5);

    const savingsPercentage = income > 0 ? ((savings / income) * 100).toFixed(0) : '0';

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { marginTop: insets.top + Spacing.md }]}>
                <View>
                    <Text style={[styles.greeting, { color: theme.textMuted }]}>Bentornato, Manuel</Text>
                    <Text style={[styles.title, { color: theme.text }]}>Il tuo Bilancio</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/settings')}
                    style={[styles.settingsButton, { backgroundColor: theme.card }]}>
                    <Settings color={theme.primary} size={20} />
                </TouchableOpacity>
            </View>

            {/* ... stats cards ... */}

            <View style={[styles.budgetCard, { backgroundColor: theme.card }]}>
                <View style={styles.budgetHeader}>
                    <Text style={[styles.statsLabel, { color: theme.textMuted }]}>Budget Mensile</Text>
                    <Text style={[styles.budgetValue, { color: theme.text }]}>
                        € {currentMonthExpenses.toLocaleString('it-IT')} / € {monthlyLimit.toLocaleString('it-IT')}
                    </Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
                    <View style={[styles.progressBarFill, { backgroundColor: budgetColor, width: `${budgetProgress * 100}%` }]} />
                </View>
                <Text style={[styles.budgetStatus, { color: budgetColor }]}>
                    {budgetProgress >= 1 ? 'Budget superato!' : `${((1 - budgetProgress) * 100).toFixed(0)}% rimanente`}
                </Text>
            </View>

            <View style={[styles.mainCard, { backgroundColor: balance >= 0 ? theme.primary : theme.danger }]}>
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
                        const category = categories.find(c => c.id === item.categoryId) || categories[0];
                        const CategoryIcon = getIcon(category.iconName);
                        return (
                            <View key={item.id} style={[styles.listItem, { backgroundColor: theme.card }]}>
                                <View style={[styles.iconBox, { backgroundColor: category.color + '20' }]}>
                                    <CategoryIcon color={category.color} size={20} />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
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
    budgetCard: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.xl,
        gap: Spacing.sm,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    budgetValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    budgetStatus: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'right',
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});
