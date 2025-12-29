import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { supabase } from '../services/supabaseClient';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bestScores, setBestScores] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Load best scores
        const { data: scores } = await supabase
          .from('user_best_score')
          .select('quiz_key, best_percentage, updated_at')
          .eq('user_id', user.id);
        
        setBestScores(scores || []);

        // Load quiz history
        const { data: history } = await supabase
          .from('quiz_history')
          .select('quiz_key, quiz_name, score, max_score, percentage, passed, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        setQuizHistory(history || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Apa Anda yakin ingin keluar?', [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Ya, Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await supabase.auth.signOut();
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTopicName = (key) => {
    const topics = {
      getaran: 'Getaran & Gelombang',
      ghs: 'GHS',
      bandul: 'Bandul',
      pegas: 'Pegas',
    };
    return topics[key?.toLowerCase()] || key || 'Kuis';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <LinearGradient
          colors={['#7c3aed', '#6366f1']}
          style={styles.header}
        >
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#ffffff" />
          </View>
          <Text style={styles.userName}>{user?.email || 'User'}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ffffff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Best Scores Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={24} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Skor Terbaik</Text>
          </View>

          {bestScores.length > 0 ? (
            <View style={styles.scoresGrid}>
              {bestScores.map((score, idx) => (
                <View key={idx} style={styles.scoreCard}>
                  <Text style={styles.scoreTopicName}>{getTopicName(score.quiz_key)}</Text>
                  <MaskedView
                    style={{ height: 60 }}
                    maskElement={
                      <View style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                        <Text style={styles.scorePercentage}>{Math.round(score.best_percentage || 0)}%</Text>
                      </View>
                    }
                  >
                    <LinearGradient
                      colors={['#ec4899', '#7c3aed']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Text style={[styles.scorePercentage, { opacity: 0 }]}>
                        {Math.round(score.best_percentage || 0)}%
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                  <Text style={styles.scoreDate}>
                    {formatDate(score.updated_at)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="trophy-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Belum ada skor kuis</Text>
              <Text style={styles.emptySubtext}>
                Mulai kerjakan kuis untuk melihat skor terbaikmu!
              </Text>
            </View>
          )}
        </View>

        {/* Quiz History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={24} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Riwayat Kuis</Text>
          </View>

          {quizHistory.length > 0 ? (
            <View style={styles.historyContainer}>
              {quizHistory.map((item, idx) => (
                <View key={idx} style={styles.historyCard}>
                  <View style={styles.historyLeft}>
                    <View style={[
                      styles.historyBadge,
                      item.passed ? styles.historyBadgePassed : styles.historyBadgeFailed
                    ]}>
                      <Ionicons
                        name={item.passed ? 'checkmark-circle' : 'close-circle'}
                        size={20}
                        color="#ffffff"
                      />
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyTopic}>
                        {getTopicName(item.quiz_key || item.quiz_name)}
                      </Text>
                      <Text style={styles.historyDate}>{formatDate(item.created_at)}</Text>
                    </View>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyScore}>
                      {item.score || 0}/{item.max_score || 0}
                    </Text>
                    <Text style={[
                      styles.historyPercentage,
                      item.passed ? styles.historyPercentagePassed : styles.historyPercentageFailed
                    ]}>
                      {Math.round(item.percentage || 0)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Belum ada riwayat kuis</Text>
              <Text style={styles.emptySubtext}>
                Riwayat percobaan kuis akan muncul di sini
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made by Kelompok 8</Text>
          <Text style={styles.footerSubtext}>
            Florecita Natawirya (18223040) & Fhatika Adhalisman Ryanjani (18223062)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  scoreCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreTopicName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  scorePercentage: {
    fontSize: 42,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  historyContainer: {
    gap: 12,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  historyBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyBadgePassed: {
    backgroundColor: '#10b981',
  },
  historyBadgeFailed: {
    backgroundColor: '#ef4444',
  },
  historyInfo: {
    flex: 1,
  },
  historyTopic: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#64748b',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  historyPercentage: {
    fontSize: 18,
    fontWeight: '700',
  },
  historyPercentagePassed: {
    color: '#10b981',
  },
  historyPercentageFailed: {
    color: '#ef4444',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
