import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import StepCircle from '../components/StepCircle';
import RankingItem from '../components/RankingItem';
import AwardItem from '../components/AwardItem';
import homeStyles from '../styles/homeStyles';

type HomeViewNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

interface HomeViewProps {
  navigation: HomeViewNavigationProp;
}

const HomeView: React.FC<HomeViewProps> = observer(({ navigation }) => {
  // Mock data
  const rankings = [
    { id: '1', name: 'Georgia', position: 1, imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '2', name: 'Jason', position: 2, imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: '3', name: 'Maria', position: 3, imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg' },
  ];
  
  const awards = [
    { id: '1', emoji: '🔥', label: 'HOT' },
    { id: '2', emoji: '🦄', label: 'OMG' },
  ];

  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      
      {/* Header */}
      <View style={homeStyles.header}>
        <TouchableOpacity style={homeStyles.menuButton}>
          <Feather name="menu" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={homeStyles.headerTitle}>step tracker (Community)</Text>
      </View>
      
      {/* Main Content */}
      <ScrollView style={homeStyles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={homeStyles.profileSection}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} 
            style={homeStyles.profileAvatar} 
          />
        </View>
        
        {/* Step Circle Component */}
        <StepCircle 
          steps={7568}
          calories={526}
          minutes={50}
          distance={5} 
        />
        
        {/* Rankings and Awards */}
        <View style={homeStyles.statsContainer}>
          <View style={homeStyles.rankingSection}>
            <Text style={homeStyles.sectionTitle}>Today's Ranking:</Text>
            {rankings.map(user => (
              <RankingItem 
                key={user.id}
                name={user.name}
                position={user.position}
                imageUrl={user.imageUrl}
              />
            ))}
          </View>
          
          <View style={homeStyles.awardsSection}>
            <Text style={homeStyles.sectionTitle}>Awards:</Text>
            <View style={homeStyles.awardsList}>
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
        
        <TouchableOpacity style={homeStyles.inventoryPrompt}>
          <Text style={homeStyles.inventoryPromptText}>→ Go and check your inventory</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Navigation Bar */}
      <View style={homeStyles.navbar}>
        <TouchableOpacity style={homeStyles.navItem}>
          <MaterialCommunityIcons name="account-group" size={22} color="#64748b" />
          <Text style={homeStyles.navLabel}>Friends</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={homeStyles.navItem}>
          <MaterialCommunityIcons name="chart-bar" size={22} color="#64748b" />
          <Text style={homeStyles.navLabel}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={homeStyles.navHomeItem}>
          <View style={homeStyles.navHomeButton}>
            <MaterialCommunityIcons name="home" size={22} color="#ffffff" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={homeStyles.navItem}>
          <MaterialCommunityIcons name="trophy" size={22} color="#64748b" />
          <Text style={homeStyles.navLabel}>Prizes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={homeStyles.navItem}>
          <MaterialCommunityIcons name="cog" size={22} color="#64748b" />
          <Text style={homeStyles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

export default HomeView; 