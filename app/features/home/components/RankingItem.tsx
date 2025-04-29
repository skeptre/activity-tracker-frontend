import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RankingItemProps {
  name: string;
  position: number;
  imageUrl?: string;
  steps?: number;
}

const RankingItem: React.FC<RankingItemProps> = ({ 
  name, 
  position, 
  imageUrl, 
  steps = 0 
}) => {
  // Define medal colors and icons based on position
  const getMedalIcon = () => {
    switch (position) {
      case 1:
        return <MaterialCommunityIcons name="medal" size={24} color="#FFD700" />;
      case 2:
        return <MaterialCommunityIcons name="medal" size={24} color="#C0C0C0" />;
      case 3:
        return <MaterialCommunityIcons name="medal" size={24} color="#CD7F32" />;
      default:
        return <Text style={styles.rankingPosition}>{position}</Text>;
    }
  };
  
  // Format steps with commas
  const formattedSteps = steps.toLocaleString();
  
  return (
    <View style={styles.rankingItem}>
      <View style={styles.rankingProfile}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.rankingAvatar} 
          />
        ) : (
          <View style={[styles.rankingAvatar, styles.defaultAvatarContainer]}>
            <Text style={styles.defaultAvatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.rankingName}>{name}</Text>
          <View style={styles.stepsContainer}>
            <MaterialCommunityIcons name="shoe-print" size={14} color="#16a34a" style={styles.footprintIcon} />
            <Text style={styles.stepsText}>{formattedSteps} steps</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.rankingBadge}>
        {getMedalIcon()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rankingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.5)',
  },
  rankingProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  defaultAvatarContainer: {
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
  },
  userInfo: {
    flex: 1,
  },
  rankingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footprintIcon: {
    marginRight: 4,
  },
  stepsText: {
    fontSize: 13,
    color: '#64748b',
  },
  rankingBadge: {
    backgroundColor: 'rgba(229, 231, 235, 0.5)',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  rankingPosition: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
});

export default RankingItem; 