import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useMoodReportViewModel } from '../../viewmodels/useMoodReportViewModel';
import { Activity } from '../../../core/domain/entities/MoodReport';
import { PieChart } from '../../components/common/PieChart';
import { RadarChart } from '../../components/common/RadarChart';
import { ModernBarChart } from '../../components/common/ModernBarChart';
import { ChartSelector, ChartType } from '../../components/common/ChartSelector';

const emotionTypeNames = {
  1: 'Mutluluk',
  2: 'Üzüntü', 
  3: 'Öfke',
  4: 'Korku',
  5: 'Kaygı',
  6: 'Huzur',
  7: 'Enerji',
  8: 'Heyecan',
  9: 'Yalnızlık',
  10: 'Rahatlık'
};

const emotionColors = {
  1: '#4ade80',
  2: '#60a5fa',
  3: '#f87171',
  4: '#facc15',
  5: '#fb923c',
  6: '#818cf8',
  7: '#22d3ee',
  8: '#f472b6',
  9: '#9ca3af',
  10: '#34d399'
};

const categoryColors = {
  'Wellness': '#8b5cf6',
  'Social': '#06b6d4', 
  'Creative': '#ec4899',
  'Physical': '#10b981',
  'Mental': '#f59e0b'
};

export function MoodReportScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('pie');
  
  // ViewModel'dan tüm state ve metodları al
  const { data, isLoading, error, retry } = useMoodReportViewModel();

  const chartData = useMemo(() => {
    if (!data?.userMoodProfile) return [];
    
    return data.userMoodProfile
      .filter(emotion => emotion.score > 0) // Only show emotions with a score
      .map(emotion => ({
        label: emotionTypeNames[emotion.emotionType],
        value: emotion.score,
        color: emotionColors[emotion.emotionType],
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const renderMoodChart = () => {
    if (!data) return null;

    const renderChart = () => {
      if (chartData.length === 0) {
        return (
          <View style={styles.chartEmptyState}>
            <Ionicons name="analytics-outline" size={48} color={theme.mutedForeground} />
            <Text style={styles.chartEmptyText}>Grafik için yeterli veri bulunamadı.</Text>
          </View>
        )
      }

      switch (selectedChartType) {
        case 'radar':
          // Radar chart is best with 5-8 items for clarity
          return (
            <RadarChart
              data={chartData.slice(0, 8)}
              maxValue={100}
            />
          );
        case 'pie':
        default:
          return (
            <PieChart
              data={chartData}
            />
          );
      }
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Ruh Hali Profili</Text>
        <ChartSelector
          selectedType={selectedChartType}
          onTypeChange={setSelectedChartType}
          theme={theme}
        />
        <View style={styles.chartDisplayContainer}>
          {renderChart()}
        </View>
      </View>
    );
  };

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColors[item.category] || '#6b7280' }]}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <View style={styles.scoreContainer}>
          <Ionicons name="heart" size={16} color="#ef4444" />
          <Text style={styles.therapeuticScore}>{item.therapeuticScore}%</Text>
        </View>
      </View>
      
      <Text style={styles.activityTitle}>{item.name}</Text>
      <Text style={styles.activityDescription}>{item.description}</Text>
      
      <View style={styles.activityDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color={theme.mutedForeground} />
          <Text style={styles.detailText}>{item.createdByUserName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={theme.mutedForeground} />
          <Text style={styles.detailText}>
            {new Date(item.eventTime).toLocaleDateString('tr-TR')}
          </Text>
        </View>
      </View>
      
      <View style={styles.moodTarget}>
        <Text style={styles.moodTargetLabel}>Hedef:</Text>
        <Text style={styles.moodTargetText}>{item.targetMoodDescription}</Text>
      </View>
      
      <Text style={styles.recommendationReason}>{item.recommendationReason}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <LoadingSpinner size="large" />
          <Text style={styles.loadingText}>Rapor yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data?.activities || []}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={() => (
          <>
            <LinearGradient
              colors={[theme.primary, theme.ring]}
              style={styles.summaryCard}
            >
              <Text style={styles.summaryTitle}>Günlük Özet</Text>
              <Text style={styles.summaryMessage}>{data?.message}</Text>
            </LinearGradient>

            {renderMoodChart()}

            <Text style={[styles.sectionTitle, { paddingHorizontal: 16 }]}>
              Önerilen Aktiviteler
            </Text>
          </>
        )}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  contentContainer: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.mutedForeground,
  },
  errorText: {
    fontSize: 16,
    color: theme.foreground,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: 20,
    padding: 24,
    margin: 16,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  summaryMessage: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 16,
  },
  chartContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  chartDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 380,
    marginTop: 16,
  },
  chartEmptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  chartEmptyText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.mutedForeground,
  },
  activityCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  therapeuticScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: theme.mutedForeground,
    lineHeight: 20,
  },
  activityDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: theme.mutedForeground,
    marginLeft: 8,
  },
  moodTarget: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodTargetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.foreground,
  },
  moodTargetText: {
    fontSize: 12,
    color: theme.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  recommendationReason: {
    fontSize: 12,
    color: theme.mutedForeground,
    fontStyle: 'italic',
    lineHeight: 16,
  },
}); 