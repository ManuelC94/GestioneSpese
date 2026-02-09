import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/Design';
import { useStore, getIcon, Category } from '../store/useStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ChevronLeft, Plus, Trash2, Edit2, Check, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Available icons to choose from
const ICON_OPTIONS = [
    'Utensils', 'ShoppingBag', 'Car', 'Tv', 'Dumbbell',
    'HeartPulse', 'GraduationCap', 'Wallet', 'PiggyBank',
    'Gift', 'Home', 'Coffee', 'Gamepad', 'Music', 'Camera'
];

const COLOR_OPTIONS = [
    '#F87171', '#818CF8', '#34D399', '#FBBF24', '#A78BFA',
    '#F472B6', '#60A5FA', '#10B981', '#F59E0B', '#94A3B8'
];

export default function CategoriesScreen() {
    const theme = Colors.dark;
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const categories = useStore(state => state.categories);
    const addCategory = useStore(state => state.addCategory);
    const updateCategory = useStore(state => state.updateCategory);
    const deleteCategory = useStore(state => state.deleteCategory);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [iconName, setIconName] = useState('Wallet');
    const [color, setColor] = useState('#818CF8');
    const [type, setType] = useState<'expense' | 'income' | 'both'>('expense');

    const handleSave = () => {
        if (!name.trim()) return;

        const catData = { name: name.trim(), iconName, color, type };

        if (editingCategory) {
            updateCategory({ ...catData, id: editingCategory.id });
        } else {
            addCategory(catData);
        }

        closeModal();
    };

    const openEdit = (cat: Category) => {
        setEditingCategory(cat);
        setName(cat.name);
        setIconName(cat.iconName);
        setColor(cat.color);
        setType(cat.type);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingCategory(null);
        setName('');
        setIconName('Wallet');
        setColor('#818CF8');
        setType('expense');
    };

    const handleDelete = (id: string) => {
        if (id === '8' || id === '10') {
            Alert.alert('Errore', 'Questa categoria è protetta e non può essere eliminata.');
            return;
        }
        Alert.alert(
            'Elimina Categoria',
            'Sei sicuro? Le transazioni associate verranno spostate in "Altro".',
            [
                { text: 'Annulla', style: 'cancel' },
                { text: 'Elimina', style: 'destructive', onPress: () => deleteCategory(id) }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft color={theme.text} size={24} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Categorie</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                    <Plus color={theme.primary} size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.list}>
                {categories.map((cat) => {
                    const Icon = getIcon(cat.iconName);
                    return (
                        <View key={cat.id} style={[styles.catItem, { backgroundColor: theme.card }]}>
                            <View style={[styles.iconBox, { backgroundColor: cat.color + '20' }]}>
                                <Icon color={cat.color} size={20} />
                            </View>
                            <View style={styles.catInfo}>
                                <Text style={[styles.catName, { color: theme.text }]}>{cat.name}</Text>
                                <Text style={[styles.catType, { color: theme.textMuted }]}>
                                    {cat.type === 'expense' ? 'Spesa' : cat.type === 'income' ? 'Entrata' : 'Entrambe'}
                                </Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => openEdit(cat)} style={styles.actionBtn}>
                                    <Edit2 color={theme.textMuted} size={18} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(cat.id)} style={styles.actionBtn}>
                                    <Trash2 color={theme.danger} size={18} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>
                                {editingCategory ? 'Modifica Categoria' : 'Nuova Categoria'}
                            </Text>
                            <TouchableOpacity onPress={closeModal}>
                                <X color={theme.textMuted} size={24} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.label, { color: theme.textMuted }]}>Nome</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                            value={name}
                            onChangeText={setName}
                            placeholder="es. Regali, Hobby..."
                            placeholderTextColor={theme.textMuted}
                        />

                        <Text style={[styles.label, { color: theme.textMuted }]}>Tipo</Text>
                        <View style={styles.typeToggle}>
                            {['expense', 'income', 'both'].map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    onPress={() => setType(t as any)}
                                    style={[
                                        styles.typeBtn,
                                        type === t && { backgroundColor: theme.primary, borderColor: theme.primary }
                                    ]}>
                                    <Text style={[styles.typeBtnText, { color: type === t ? 'white' : theme.textMuted }]}>
                                        {t === 'expense' ? 'Spesa' : t === 'income' ? 'Entrata' : 'Entrambi'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.label, { color: theme.textMuted }]}>Icona</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                            {ICON_OPTIONS.map((icon) => {
                                const Icon = getIcon(icon);
                                return (
                                    <TouchableOpacity
                                        key={icon}
                                        onPress={() => setIconName(icon)}
                                        style={[
                                            styles.optionBtn,
                                            iconName === icon && { borderColor: theme.primary, borderWidth: 2 }
                                        ]}>
                                        <Icon color={iconName === icon ? theme.primary : theme.textMuted} size={24} />
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <Text style={[styles.label, { color: theme.textMuted }]}>Colore</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                            {COLOR_OPTIONS.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    onPress={() => setColor(c)}
                                    style={[
                                        styles.colorBtn,
                                        { backgroundColor: c },
                                        color === c && { borderColor: 'white', borderWidth: 2 }
                                    ]}
                                />
                            ))}
                        </ScrollView>

                        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={handleSave}>
                            <Text style={styles.saveBtnText}>Salva Categoria</Text>
                        </TouchableOpacity>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    backButton: { width: 44, height: 44, justifyContent: 'center' },
    addButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-end' },
    title: { fontSize: 20, fontWeight: 'bold' },
    list: { padding: Spacing.md, gap: Spacing.sm },
    catItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        gap: Spacing.md,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    catInfo: { flex: 1 },
    catName: { fontSize: 16, fontWeight: '600' },
    catType: { fontSize: 12 },
    actions: { flexDirection: 'row', gap: Spacing.sm },
    actionBtn: { padding: 8 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        padding: Spacing.lg,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        gap: Spacing.md,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    label: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
    input: {
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        fontSize: 16,
    },
    typeToggle: { flexDirection: 'row', gap: Spacing.sm },
    typeBtn: {
        flex: 1,
        padding: 10,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: 'transparent',
        alignItems: 'center',
    },
    typeBtnText: { fontWeight: '600', fontSize: 12 },
    optionsScroll: { flexDirection: 'row', paddingVertical: 4 },
    optionBtn: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    colorBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: Spacing.sm,
    },
    saveBtn: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    saveBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
