import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

// This is a placeholder for the full compatibility data type based on the user's JSON
type CompatibilityData = {
  moodCompatibility: number;
  compatibilityCategory: string;
  detailedAnalysis: string;
  emotionComparisons: EmotionComparison[];
  user: {
      firstName: string;
  };
  targetUser: {
      firstName: string;
  };
};

type EmotionComparison = {
  emotionName: string;
  userScore: number;
  targetUserScore: number;
  compatibilityLevel: string;
};

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.35; // Set item width to 35% of screen width

const getCompatibilityColor = (level: string) => {
  switch (level) {
    case 'Çok Benzer':
      return '#4ade80'; // green-400
    case 'Benzer':
      return '#60a5fa'; // blue-400
    case 'Orta':
      return '#facc15'; // yellow-400
    case 'Farklı':
      return '#f87171'; // red-400
    default:
      return '#9ca3af'; // gray-400
  }
};

const getScoreColor = (percentage: number) => {
    if (percentage >= 75) return '#4ade80'; // green-400
    if (percentage >= 50) return '#facc15'; // yellow-400
    return '#f87171'; // red-400
};

const CircularProgress = ({ size, strokeWidth, percentage, progressColor, theme }: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = percentage / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          stroke={theme.border}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={progressColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontWeight="bold"
          fontSize="24"
          fill={theme.foreground}
        >
          {`${Math.round(percentage)}%`}
        </SvgText>
      </Svg>
    </View>
  );
};

const EmotionComparisonBar = ({ comparison, theme, userFirstName, targetUserFirstName }: any) => {
    const styles = getStyles(theme);
    
    const userScore = Math.max(comparison.userScore, 1);
    const targetUserScore = Math.max(comparison.targetUserScore, 1);
    const totalScore = userScore + targetUserScore;
  
    return (
      <View style={styles.comparisonContainer}>
        <View style={styles.comparisonHeader}>
            <Text style={styles.emotionName}>{comparison.emotionName}</Text>
            <View style={[styles.levelBadge, { backgroundColor: getCompatibilityColor(comparison.compatibilityLevel) }]}>
                <Text style={styles.levelText}>{comparison.compatibilityLevel}</Text>
            </View>
        </View>

        <View style={styles.barsRow}>
            <View style={{...styles.bar, backgroundColor: theme.primary, width: `${(userScore / totalScore) * 100}%` }} />
            <View style={{...styles.bar, backgroundColor: '#a1a1aa', width: `${(targetUserScore / totalScore) * 100}%` }} />
        </View>
        <View style={styles.barLabelsContainer}>
            <Text style={styles.barLabel}>
                <Text style={{color: theme.primary, fontWeight: 'bold'}}>⬤</Text> {userFirstName} ({comparison.userScore}%)
            </Text>
            <Text style={styles.barLabel}>
                <Text style={{color: '#a1a1aa', fontWeight: 'bold'}}>⬤</Text> {targetUserFirstName} ({comparison.targetUserScore}%)
            </Text>
        </View>
      </View>
    );
};
  

export const CompatibilityReport = ({ compatibilityData }: { compatibilityData: CompatibilityData }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (!compatibilityData) return null;

  const {
    moodCompatibility,
    compatibilityCategory,
    detailedAnalysis,
    emotionComparisons,
    user,
    targetUser,
  } = compatibilityData;

  const scoreColor = getScoreColor(moodCompatibility);

  return (
    <LinearGradient
      colors={[theme.card, theme.background]}
      style={styles.container}
    >
      <View style={styles.header}>
        <CircularProgress
          size={120}
          strokeWidth={12}
          percentage={moodCompatibility}
          progressColor={scoreColor}
          theme={theme}
        />
        <View style={styles.headerTextContainer}>
            <Text style={styles.categoryText}>{compatibilityCategory}</Text>
        </View>
      </View>
      
      <View style={styles.analysisDetails}>
        <Text style={styles.analysisFullText}>{detailedAnalysis.replace(/\\n/g, '\n')}</Text>
      </View>

      <Text style={styles.comparisonTitle}>Duygu Karşılaştırması</Text>
      
      <FlatList
        horizontal
        data={emotionComparisons}
        renderItem={({ item }) => (
            <EmotionComparisonBar 
                comparison={item} 
                theme={theme}
                userFirstName={user.firstName}
                targetUserFirstName={targetUser.firstName}
            />
        )}
        keyExtractor={(item, index) => `${item.emotionName}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.comparisonListContainer}
      />
    </LinearGradient>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.border,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: 20,
        justifyContent: 'center',
    },
    categoryText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.foreground,
        marginBottom: 4,
        flexShrink: 1,
    },
    analysisDetails: {
        backgroundColor: theme.background,
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    analysisFullText: {
        fontSize: 14,
        color: theme.foreground,
        lineHeight: 22,
        textAlign: 'left',
    },
    comparisonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.foreground,
        marginBottom: 12,
        marginTop: 8,
    },
    comparisonListContainer: {
        paddingHorizontal: 8,
    },
    comparisonContainer: {
        width: ITEM_WIDTH,
        marginRight: 12,
        padding: 10,
        backgroundColor: theme.background,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.border,
        justifyContent: 'space-between',
    },
    comparisonHeader: {
        alignItems: 'center',
        marginBottom: 8,
    },
    emotionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emotionName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.foreground,
        textAlign: 'center',
    },
    levelBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
        marginTop: 4,
    },
    levelText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'white',
    },
    barsRow: {
        flexDirection: 'row',
        width: '100%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: theme.border,
    },
    bar: {
        height: '100%',
    },
    barLabel: {
        fontSize: 11,
        color: theme.mutedForeground,
        alignItems: 'center',
        marginBottom: 2,
    },
    barLabelsContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 6,
        paddingHorizontal: 4,
    },
}); 