import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ImageSourcePropType,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';

type HomeViewNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

interface RankingItemProps {
  name: string;
  position: number;
  imageUrl: string;
}

interface AwardItemProps {
  emoji: string;
  label: string;
}

interface HomeViewProps {
  navigation: HomeViewNavigationProp;
}

const StepCircle = () => {
  return (
    <View style={styles.stepCircleContainer}>
      <View style={styles.stepCircleOuter}>
        <View style={styles.stepCircleDashed} />
        <View style={styles.stepCircleInner}>
          <View style={styles.stepIconContainer}>
            <Text style={styles.stepIcon}>👣</Text>
          </View>
          <Text style={styles.stepCount}>7,568</Text>
          <Text style={styles.stepLabel}>DAILY STEPS</Text>
        </View>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <View style={[styles.metricIcon, styles.calorieIcon]}>
            <Text>🔥</Text>
          </View>
          <Text style={styles.metricValue}>526 kcal</Text>
        </View>
        
        <View style={styles.metricItem}>
          <View style={[styles.metricIcon, styles.timeIcon]}>
            <Text>⏱️</Text>
          </View>
          <Text style={styles.metricValue}>50 min</Text>
        </View>
        
        <View style={styles.metricItem}>
          <View style={[styles.metricIcon, styles.distanceIcon]}>
            <Text>📍</Text>
          </View>
          <Text style={styles.metricValue}>5 km</Text>
        </View>
      </View>
    </View>
  );
};

const RankingItem: React.FC<RankingItemProps> = ({ name, position, imageUrl }) => {
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
      
      {position === 1 && (
        <View style={styles.rankingBadge}>
          <Text style={styles.rankingPosition}>🥇</Text>
        </View>
      )}
    </View>
  );
};

const AwardItem: React.FC<AwardItemProps> = ({ emoji, label }) => {
  return (
    <View style={styles.awardItem}>
      <Text style={styles.awardEmoji}>{emoji}</Text>
      <Text style={styles.awardLabel}>{label}</Text>
    </View>
  );
};

const HomeView: React.FC<HomeViewProps> = observer(({ navigation }) => {
  // Mock data
  const rankings = [
    { id: '1', name: 'Georia', position: 1, imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '2', name: 'Jason', position: 2, imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: '3', name: 'Maria', position: 3, imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg' },
  ];
  
  const awards = [
    { id: '1', emoji: '🔥', label: 'HOT' },
    { id: '2', emoji: '🦄', label: 'OMG' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333333" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>step tracker (Community)</Text>
      </View>
      
      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
            style={styles.profileAvatar} 
          />
        </View>
        
        {/* Step Circle */}
        <StepCircle />
        
        {/* Rankings and Awards */}
        <View style={styles.statsContainer}>
          <View style={styles.rankingSection}>
            <Text style={styles.sectionTitle}>Today's Ranking:</Text>
            {rankings.map(user => (
              <RankingItem 
                key={user.id}
                name={user.name}
                position={user.position}
                imageUrl={user.imageUrl}
              />
            ))}
          </View>
          
          <View style={styles.awardsSection}>
            <Text style={styles.sectionTitle}>Awards:</Text>
            <View style={styles.awardsList}>
              {awards.map(award => (
                <AwardItem 
                  key={award.id}
                  emoji={award.emoji}
                  label={award.label}
                />
              ))}
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.inventoryPrompt}>
          <Text style={styles.inventoryPromptText}>→ Go and check your inventory</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Friends</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navHomeItem}>
          <View style={styles.navHomeButton}>
            <Text style={styles.navHomeIcon}>🏠</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏆</Text>
          <Text style={styles.navLabel}>Prizes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#16a34a',
  },
  menuButton: {
    marginRight: 15,
  },
  menuIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 10,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  stepCircleContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  stepCircleOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepCircleDashed: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    borderColor: '#4ade80',
    borderStyle: 'dotted',
  },
  stepCircleInner: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  stepIconContainer: {
    marginBottom: 10,
  },
  stepIcon: {
    fontSize: 30,
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  stepLabel: {
    fontSize: 14,
    color: '#888888',
    marginTop: 5,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingHorizontal: 10,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  calorieIcon: {
    backgroundColor: '#dcfce7',
  },
  timeIcon: {
    backgroundColor: '#dcfce7',
  },
  distanceIcon: {
    backgroundColor: '#dcfce7',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  rankingSection: {
    flex: 1,
    marginRight: 10,
  },
  awardsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  rankingProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankingAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  rankingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  rankingBadge: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankingPosition: {
    fontSize: 16,
  },
  awardsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  awardItem: {
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  awardEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  awardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  inventoryPrompt: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  inventoryPromptText: {
    fontSize: 14,
    color: '#666666',
  },
  navbar: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingHorizontal: 10,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navHomeItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navHomeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    shadowColor: '#16a34a',
    shadowOffset: {
      width: 0, 
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  navHomeIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 12,
    color: '#666666',
  },
});

export default HomeView; 