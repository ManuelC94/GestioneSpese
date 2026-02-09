import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/Design';
import { Filter, ChevronDown, ShoppingBag, Utensils, Car } from 'lucide-react-native';

export default function HistoryScreen() {
    const theme = Colors.dark;

    const categories = [
        { icon: ShoppingBag, label: 'Shopping', color: '#818CF8', amount: '- € 120,00', date: 'Ieri' },
        { icon: Utensils, label: 'Cibo', color: '#F87171', amount: '- € 45,50', date: '8 Feb' },
        { icon: Car, label: 'Trasporti', color: '#34D399', amount: '- € 20,00', date: '7 Feb' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.filterBar}>
                <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.card }]}>
                    <Text style={[styles.filterText, { color: theme.text }]}>Febbraio 2026</Text>
                    <ChevronDown color={theme.textMuted} size={16} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card }]}>
                    <Filter color={theme.text} size={20} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll}>
                <View style={styles.monthSection}>
                    <Text style={[styles.dateHeader, { color: theme.textMuted }]}>QUESTA SETTIMANA</Text>
                    {categories.map((item, index) => (
                        <TouchableOpacity key={index} style={[styles.transactionItem, { borderBottomColor: theme.border }]}>
                            <View style={[styles.iconWrapper, { backgroundColor: item.color + '20' }]}>
                                <item.icon color={item.color} size={22} />
                            </View>
                            <View style={styles.itemName}>
                                <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
                                <Text style={[styles.subLabel, { color: theme.textMuted }]}>{item.date}</Text>
                            </View>
                            <Text style={[styles.amount, { color: theme.danger }]}>{item.amount}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.monthSection}>
                    <Text style={[styles.dateHeader, { color: theme.textMuted }]}>GENNAIO 2026</Text>
                    <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Spesa Totale</Text>
                            <Text style={[styles.summaryValue, { color: theme.text }]}>€ 1.240,00</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={{ color: theme.primary, fontWeight: 'bold' }}>DETTAGLI</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterBar: {
        flexDirection: 'row',
        padding: Spacing.md,
        gap: Spacing.sm,
        zIndex: 10,
    },
    filterButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        height: 48,
        borderRadius: BorderRadius.md,
    },
    filterText: {
        fontSize: 16,
        fontWeight: '600',
    },
    iconButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.md,
    },
    scroll: {
        flex: 1,
    },
    monthSection: {
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    dateHeader: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: Spacing.md,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        gap: Spacing.md,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemName: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    subLabel: {
        fontSize: 13,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    summaryCard: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
    },
    summaryItem: {
        gap: 4,
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
