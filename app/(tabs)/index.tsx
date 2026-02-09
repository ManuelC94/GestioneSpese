import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/Design';
import { Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react-native';

export default function DashboardScreen() {
    const theme = Colors.dark;

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.greeting, { color: theme.textMuted }]}>Bentornato, Manuel</Text>
                <Text style={[styles.title, { color: theme.text }]}>Il tuo Bilancio</Text>
            </View>

            <View style={[styles.mainCard, { backgroundColor: theme.primary }]}>
                <View style={styles.cardHeader}>
                    <Wallet color="white" size={24} />
                    <Text style={styles.cardTitle}>Saldo Totale</Text>
                </View>
                <Text style={styles.balance}>€ 2.450,00</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.cardSubtitle}>+ € 120,50 questo mese</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
                    <ArrowUpCircle color={theme.success} size={20} />
                    <Text style={[styles.statsLabel, { color: theme.textMuted }]}>Entrate</Text>
                    <Text style={[styles.statsValue, { color: theme.success }]}>€ 3.200</Text>
                </View>
                <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
                    <ArrowDownCircle color={theme.danger} size={20} />
                    <Text style={[styles.statsLabel, { color: theme.textMuted }]}>Uscite</Text>
                    <Text style={[styles.statsValue, { color: theme.danger }]}>€ 750</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Recenti</Text>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.listItem, { backgroundColor: theme.card }]}>
                        <View style={[styles.iconBox, { backgroundColor: theme.border }]}>
                            <ArrowDownCircle color={theme.text} size={20} />
                        </View>
                        <View style={styles.listItemContent}>
                            <Text style={[styles.listItemTitle, { color: theme.text }]}>Spesa Esempio {i}</Text>
                            <Text style={[styles.listItemDate, { color: theme.textMuted }]}>Oggi, 10:30</Text>
                        </View>
                        <Text style={[styles.listItemAmount, { color: theme.danger }]}>- € 15,00</Text>
                    </View>
                ))}
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
        fontSize: 36,
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
        marginBottom: Spacing.xl,
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
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: Spacing.md,
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
        width: 40,
        height: 40,
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
