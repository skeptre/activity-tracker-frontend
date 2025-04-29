import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RankingItemProps {
  name: string;
  position: number;
  imageUrl: string;
}

const RankingItem: React.FC<RankingItemProps> = ({ name, position, imageUrl }) => {
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
  
  return (
    <View style={styles.rankingItem}>
      <View style={styles.rankingProfile}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.rankingAvatar} 
          defaultSource={require('../../../assets/appIcons/1024.png')}
        />
        <Text style={styles.rankingName}>{name}</Text>
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.5)',
  },
  rankingProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankingAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  rankingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  rankingBadge: {
    backgroundColor: 'rgba(229, 231, 235, 0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankingPosition: {
    fontSize: 20,
  },
});

export default RankingItem; 