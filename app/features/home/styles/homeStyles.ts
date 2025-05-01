import { StyleSheet, Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#16a34a',
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 32, // To balance the menu icon
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Extra padding at bottom to ensure content is scrollable
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#16a34a',
  },
  defaultAvatar: {
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#16a34a',
  },
  mockDataButton: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  mockDataText: {
    color: '#16a34a',
    fontSize: 14,
    textAlign: 'center',
  },
  statsContainer: {
    marginVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rankingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: 20,
    fontSize: 14,
  },
  awardsSection: {
    marginTop: 10,
  },
  awardsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inventoryPrompt: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  inventoryPromptText: {
    color: '#0284c7',
    fontWeight: '500',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#16a34a',
    fontWeight: '500',
  },
  navHomeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 15,
  },
  navProfileItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navSettingsItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 15,
  },
  navHomeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  navProfileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navSettingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navHomeIcon: {
    fontSize: 22,
    color: '#ffffff',
  },
});

export default homeStyles; 