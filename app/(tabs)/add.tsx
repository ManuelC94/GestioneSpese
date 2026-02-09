import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/Design';
import { Tag, Calendar, ChevronRight } from 'lucide-react-native';

export default function AddExpenseScreen() {
    const theme = Colors.dark;

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.amountContainer}>
                <Text style={[styles.label, { color: theme.textMuted }]}>Importo Spesa</Text>
                <View style={styles.inputWrapper}>
                    <Text style={[styles.currency, { color: theme.primary }]}>€</Text>
                    <TextInput
                        style={[styles.amountInput, { color: theme.text }]}
                        placeholder="0,00"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="numeric"
                        autoFocus
                    />
                </View>
            </View>

            <View style={styles.form}>
                <TouchableOpacity style={[styles.formItem, { backgroundColor: theme.card }]}>
                    <Tag color={theme.primary} size={24} />
                    <View style={styles.formItemContent}>
                        <Text style={[styles.formItemLabel, { color: theme.textMuted }]}>Categoria</Text>
                        <Text style={[styles.formItemValue, { color: theme.text }]}>Seleziona categoria</Text>
                    </View>
                    <ChevronRight color={theme.textMuted} size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.formItem, { backgroundColor: theme.card }]}>
                    <Calendar color={theme.primary} size={24} />
                    <View style={styles.formItemContent}>
                        <Text style={[styles.formItemLabel, { color: theme.textMuted }]}>Data</Text>
                        <Text style={[styles.formItemValue, { color: theme.text }]}>Oggi, 9 Febbraio</Text>
                    </View>
                    <ChevronRight color={theme.textMuted} size={20} />
                </TouchableOpacity>

                <View style={[styles.notesContainer, { backgroundColor: theme.card }]}>
                    <Text style={[styles.formItemLabel, { color: theme.textMuted, marginBottom: Spacing.sm }]}>Note (Opzionale)</Text>
                    <TextInput
                        style={[styles.notesInput, { color: theme.text }]}
                        placeholder="Aggiungi una descrizione..."
                        placeholderTextColor={theme.textMuted}
                        multiline
                    />
                </View>

                <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.primary }]}>
                    <Text style={styles.submitButtonText}>Salva Spesa</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    amountContainer: {
        padding: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: Spacing.md,
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
        fontSize: 64,
        fontWeight: 'bold',
        minWidth: 150,
        textAlign: 'center',
    },
    form: {
        padding: Spacing.md,
        gap: Spacing.md,
    },
    formItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        gap: Spacing.md,
    },
    formItemContent: {
        flex: 1,
    },
    formItemLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    formItemValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    notesContainer: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        minHeight: 120,
    },
    notesInput: {
        fontSize: 14,
        textAlignVertical: 'top',
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
