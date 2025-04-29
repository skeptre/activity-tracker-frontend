import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AwardItemProps {
  emoji: string;
  label: string;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
}

const AwardItem: React.FC<AwardItemProps> = ({ 
  emoji, 
  label, 
  iconName,
  iconColor = '#f59e0b' 
}) => {
  // Map common emoji to icon names
  const getIconName = (): keyof typeof MaterialCommunityIcons.glyphMap => {
    // If iconName is provided, use it
    if (iconName) return iconName;
    
    // Otherwise map from emoji
    switch (emoji) {
      case '🔥': return 'fire';
      case '🦄': return 'unicorn-variant';
      case '⭐': return 'star';
      case '💪': return 'arm-flex';
      case '🏆': return 'trophy';
      default: return 'trophy-award';
    }
  };
  
  // Map common emoji to icon colors
  const getIconColor = () => {
    if (iconColor !== '#f59e0b') return iconColor;
    
    switch (emoji) {
      case '🔥': return '#ef4444';
      case '🦄': return '#8b5cf6';
      case '⭐': return '#f59e0b';
      case '💪': return '#10b981';
      case '🏆': return '#f59e0b';
      default: return '#f59e0b';
    }
  };
  
  return (
    <View style={styles.awardItem}>
      <MaterialCommunityIcons 
        name={getIconName()} 
        size={24} 
        color={getIconColor()} 
        style={styles.awardIcon}
      />
      <Text style={styles.awardLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  awardItem: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  awardIcon: {
    marginBottom: 4,
  },
  awardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
});

export default AwardItem; 