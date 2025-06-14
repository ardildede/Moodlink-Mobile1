import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { themes, ThemeName } from '../../theme/Colors';

const themeDisplayData = {
    gece: { name: 'Gece', description: 'Koyu gri tonlar', color: '#2d2d30' },
    white: { name: 'White', description: 'Temiz ve minimal', color: '#E3E3E8' },
    love: { name: 'Love', description: 'Romantik pembe tonları', color: '#f44383' },
    dogasever: { name: 'Doğasever', description: 'Rahatlatıcı açık yeşil tonlar', color: '#4d994d' },
    gokyuzu: { name: 'Gökyüzü', description: 'Ferahlatıcı açık mavi tonlar', color: '#3b82f6' },
    lavanta: { name: 'Lavanta', description: 'Sakinleştirici mor tonlar', color: '#8b5cf6' },
    gunbatimi: { name: 'Günbatımı', description: 'Sıcak ve dinlendirici tonlar', color: '#f68b5c' },
};

export function ThemeSelectionScreen({ navigation }: any) {
    const { theme, themeName, setTheme } = useTheme();
    const styles = getStyles(theme);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.sectionTitle}>Mevcut Temalar:</Text>
                {Object.keys(themes).map((key) => {
                    const currentThemeName = key as ThemeName;
                    const display = themeDisplayData[currentThemeName];
                    const isSelected = currentThemeName === themeName;
                    return (
                        <TouchableOpacity 
                            key={currentThemeName} 
                            style={[styles.themeItem, isSelected && styles.selectedThemeItem]} 
                            onPress={() => setTheme(currentThemeName)}
                        >
                            <View style={styles.themeInfo}>
                                <View style={[styles.themeColorPreview, { backgroundColor: display.color }]} />
                                <View>
                                    <Text style={styles.themeName}>{display.name}</Text>
                                    <Text style={styles.themeDescription}>{display.description}</Text>
                                </View>
                            </View>
                            {isSelected && (
                                <View style={styles.selectedIconContainer}>
                                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    scrollContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.mutedForeground,
        marginBottom: 16,
    },
    themeItem: {
        backgroundColor: theme.card,
        padding: 20,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedThemeItem: {
        borderColor: theme.primary,
    },
    themeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeColorPreview: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 16,
    },
    themeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.foreground,
    },
    themeDescription: {
        fontSize: 14,
        color: theme.mutedForeground,
        marginTop: 2,
    },
    selectedIconContainer: {
        padding: 4,
    },
}); 