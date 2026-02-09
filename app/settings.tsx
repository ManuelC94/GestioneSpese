import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/Design';
import { useStore } from '../store/useStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, Trash2, ShieldCheck, Info, CreditCard, LayoutGrid } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function SettingsScreen() {
    const theme = Colors.dark;
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const monthlyLimit = useStore(state => state.monthlyLimit);
    const setMonthlyLimit = useStore(state => state.setMonthlyLimit);
    const clearTransactions = useStore(state => state.clearTransactions);
    const resetCategories = useStore(state => state.resetCategories);
    const transactions = useStore(state => state.transactions);

    const [tempLimit, setTempLimit] = useState(monthlyLimit.toString());

    const handleUpdateLimit = () => {
        const val = parseFloat(tempLimit.replace(',', '.'));
        if (!isNaN(val) && val > 0) {
            setMonthlyLimit(val);
            Alert.alert('Successo', 'Budget mensile aggiornato!');
        }
    };

    const handleClearData = () => {
        Alert.alert(
            'Attenzione',
            'Sei sicuro di voler eliminare tutte le transazioni? Questa azione non è reversibile.',
            [
                { text: 'Annulla', style: 'cancel' },
                {
                    text: 'Elimina Tutto',
                    style: 'destructive',
                    onPress: () => {
                        clearTransactions();
                        Alert.alert('Reset', 'Tutti i dati sono stati eliminati.');
                    }
                }
            ]
        );
    };

    const exportToCSV = async () => {
        if (transactions.length === 0) {
            Alert.alert('Errore', 'Nessuna transazione da esportare.');
            return;
        }

        const header = 'Data,Titolo,Importo,Tipo\n';
        const rows = transactions.map(t => `${t.date},"${t.title}",${t.amount},${t.type}`).join('\n');
        const csvContent = header + rows;

        const fileUri = FileSystem.documentDirectory + 'transazioni_gestionespese.csv';

        try {
            await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
            await Sharing.shareAsync(fileUri);
        } catch (error) {
            console.error('Export error:', error);
            Alert.alert('Errore', 'Impossibile esportare il file.');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft color={theme.text} size={24} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Impostazioni</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Preferenze</Text>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <CreditCard color={theme.primary} size={20} />
                                <View>
                                    <Text style={[styles.settingLabel, { color: theme.text }]}>Budget Mensile</Text>
                                    <Text style={[styles.settingSub, { color: theme.textMuted }]}>Limite di spesa suggerito</Text>
                                </View>
                            </View>
                            <View style={styles.limitInputContainer}>
                                <Text style={{ color: theme.text, marginRight: 4 }}>€</Text>
                                <TextInput
                                    style={[styles.limitInput, { color: theme.text, borderBottomColor: theme.border }]}
                                    value={tempLimit}
                                    onChangeText={setTempLimit}
                                    onBlur={handleUpdateLimit}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Gestione Dati</Text>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <TouchableOpacity onPress={() => router.push('/categories')} style={[styles.settingRow, styles.borderBottom]}>
                            <View style={styles.settingInfo}>
                                <LayoutGrid color={theme.primary} size={20} />
                                <Text style={[styles.settingLabel, { color: theme.text }]}>Gestisci Categorie</Text>
                            </View>
                            <ChevronRight color={theme.textMuted} size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={exportToCSV} style={[styles.settingRow, styles.borderBottom]}>
                            <View style={styles.settingInfo}>
                                <Share2 color={theme.success} size={20} />
                                <Text style={[styles.settingLabel, { color: theme.text }]}>Esporta in CSV</Text>
                            </View>
                            <ChevronRight color={theme.textMuted} size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            Alert.alert(
                                'Ripristina Categorie',
                                'Vuoi ripristinare le categorie predefinite? Le tue categorie personalizzate andranno perse, ma le transazioni rimarranno.',
                                [
                                    { text: 'Annulla', style: 'cancel' },
                                    { text: 'Ripristina', onPress: () => { resetCategories(); Alert.alert('Fatto', 'Categorie ripristinate!'); } }
                                ]
                            );
                        }} style={[styles.settingRow, styles.borderBottom]}>
                            <View style={styles.settingInfo}>
                                <LayoutGrid color={theme.warning} size={20} />
                                <Text style={[styles.settingLabel, { color: theme.text }]}>Ripristina Categorie</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleClearData} style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Trash2 color={theme.danger} size={20} />
                                <Text style={[styles.settingLabel, { color: theme.text }]}>Elimina Tutti i Dati</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Informazioni</Text>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <View style={[styles.settingRow, styles.borderBottom]}>
                            <View style={styles.settingInfo}>
                                <ShieldCheck color={theme.primary} size={20} />
                                <Text style={[styles.settingLabel, { color: theme.text }]}>Privacy</Text>
                            </View>
                            <Text style={[styles.settingSub, { color: theme.textMuted }]}>Dati Locali</Text>
                        </View>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Info color={theme.textMuted} size={20} />
                                <Text style={[styles.settingLabel, { color: theme.text }]}>Versione</Text>
                            </View>
                            <Text style={[styles.settingSub, { color: theme.textMuted }]}>1.0.0</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    backButton: { width: 44, height: 44, justifyContent: 'center' },
    title: { fontSize: 20, fontWeight: 'bold' },
    content: { padding: Spacing.md, gap: Spacing.xl },
    section: { gap: Spacing.sm },
    sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginLeft: 8 },
    card: {
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    settingLabel: { fontSize: 16, fontWeight: '600' },
    settingSub: { fontSize: 13 },
    limitInputContainer: { flexDirection: 'row', alignItems: 'center' },
    limitInput: {
        width: 80,
        textAlign: 'right',
        fontSize: 16,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        paddingBottom: 2,
    },
    footer: {
        textAlign: 'center',
        marginTop: Spacing.lg,
        fontSize: 12,
        opacity: 0.6,
    },
});
