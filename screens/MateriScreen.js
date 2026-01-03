import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabaseClient';

const MATERI_DATA = [
  {
    id: 'getaran',
    title: 'Getaran & Gelombang',
    subtitle: 'Pengantar tentang getaran, gelombang, amplitudo, frekuensi, dan contoh sehari-hari.',
    videoUrl: 'https://www.youtube.com/watch?v=wglGwxYFPpM',
    content: [
      {
        heading: 'Pengertian Getaran',
        text: 'Getaran adalah gerak bolak-balik suatu benda melewati titik setimbang. Satu periode adalah waktu untuk satu getaran penuh (kembali ke posisi semula).',
      },
      {
        heading: 'Contoh — Bandul',
        text: 'Bandul bergetar bolak-balik di sekitar titik setimbang; simpangan terjauh disebut amplitudo. Satu getaran penuh misalnya A→B→C→B→A.',
      },
      {
        heading: 'Besaran Penting',
        list: [
          'Periode (T): waktu satu getaran (s).',
          'Frekuensi (f): jumlah getaran per detik (Hz).',
          'Simpangan / Amplitudo (x / A): jarak dari titik setimbang (m).',
        ],
      },
      {
        heading: 'Rumus Singkat',
        text: 'Contoh: pegas/GHS → T = 2π√(m/k). Bandul kecil → T = 2π√(L/g).',
      },
      {
        heading: 'Gelombang (singkat)',
        text: 'Gelombang adalah perambatan gangguan/energi dari satu titik ke titik lain (contoh: riak air, gelombang suara).',
      },
      {
        heading: 'Klasifikasi (medium)',
        list: [
          'Mekanik: butuh medium (contoh: bunyi).',
          'Elektromagnetik: tak butuh medium (contoh: cahaya).',
        ],
      },
      {
        heading: 'Klasifikasi (arah rambat)',
        list: [
          'Longitudinal: getaran sejajar arah rambat.',
          'Transversal: getaran tegak lurus arah rambat.',
        ],
      },
      {
        heading: 'Sifat Utama',
        text: 'Gelombang dapat dipantulkan, dipadukan (superposisi), dibiaskan (refraksi), dan dilenturkan (difraksi).',
      },
    ],
  },
  {
    id: 'ghs',
    title: 'Gerak Harmonik Sederhana (GHS)',
    subtitle: 'Konsep GHS, hukum Hooke, periode, frekuensi, energi.',
    videoUrl: 'https://www.youtube.com/watch?v=q2Hnk39kIe4',
    content: [
      {
        heading: 'Analisis Singkat',
        text: 'Simpangan pada GHS sering ditulis sebagai:\n\ny(t) = A sin(ω t)\n\nDengan ω = 2π f dan hubungan penting:\n\nT = 2π √(m / k)    ω = √(k / m)\n\nKecepatan dan percepatan dihasilkan dari turunan waktu:\n\nv(t) = A ω cos(ω t)\na(t) = −A ω² sin(ω t) = −ω² y(t)',
      },
      {
        heading: 'Contoh Singkat',
        text: 'Jika k = 10 N/m dan m = 1 kg, maka ω = √(10/1) ≈ 3.162 rad/s dan T = 2π/ω ≈ 1.987 s.',
      },
    ],
  },
  {
    id: 'bandul',
    title: 'Bandul',
    subtitle: 'Bandul matematis: periode, sudut kecil, dan contoh eksperimen.',
    videoUrl: 'https://www.youtube.com/watch?v=jnDb4JWf9ps',
    content: [
      {
        heading: 'Bandul — Definisi Singkat',
        text: 'Bandul adalah beban yang digantungkan pada tali sehingga dapat berayun bebas dan periodik akibat gravitasi. Gerak bandul mendekati Gerak Harmonik Sederhana (GHS) bila sudut simpangannya kecil.',
      },
      {
        heading: 'Komponen & Gerak',
        text: 'Bandul terdiri dari massa (beban) yang terhubung ke titik tumpu melalui tali. Bila ditarik dan dilepaskan, bandul bergerak bolak-balik melintasi posisi setimbangnya.',
      },
      {
        heading: 'Persamaan Periode',
        text: 'Periode bandul yang ideal (sudut kecil) hanya bergantung pada panjang tali L dan percepatan gravitasi g:\n\nT = 2π √(L / g)',
      },
      {
        heading: 'Besaran yang Terlibat',
        list: [
          'Periode (T) — Waktu satu ayunan penuh.',
          'Amplitudo — Simpangan terjauh dari titik setimbang.',
          'Frekuensi — Jumlah ayunan per satuan waktu.',
        ],
      },
      {
        heading: 'Faktor yang Mempengaruhi',
        text: 'Periode dipengaruhi oleh panjang tali L dan percepatan gravitasi g. Untuk bandul sederhana, massa benda tidak mempengaruhi periode.',
      },
      {
        heading: 'Catatan',
        text: 'Pada amplitudo kecil (biasanya ±10°), periode tidak bergantung signifikan pada amplitudo. Gaya gesek akan menyebabkan peredaman sehingga gerak tidak ideal lagi.',
      },
    ],
  },
  {
    id: 'pegas',
    title: 'Pegas',
    subtitle: 'Hukum Hooke, konstanta pegas, dan hubungan dengan GHS.',
    videoUrl: 'https://www.youtube.com/watch?v=nVkj6GrHIn8',
    content: [
      {
        heading: 'Pengenalan Pegas',
        text: 'Pegas adalah benda elastis yang dapat menyimpan energi mekanik dan kembali ke bentuk semula setelah diberi gaya. Sifat elastisnya dijelaskan oleh Hukum Hooke.',
      },
      {
        heading: 'Hukum Hooke',
        text: 'Hukum Hooke menyatakan bahwa gaya pemulih pada pegas berbanding lurus dengan pertambahan panjangnya:\n\nF = k · Δx\n\nDi mana k adalah konstanta pegas dan Δx adalah perubahan panjang.',
      },
      {
        heading: 'Energi Potensial Elastis',
        text: 'Pegas yang ditekan atau ditarik menyimpan energi potensial elastis sebesar:\n\nE = ½ k Δx²',
      },
      {
        heading: 'Sifat & Karakteristik',
        list: [
          'Elastisitas: kemampuan kembali ke bentuk semula.',
          'Linearitas: untuk rentang kecil, gaya berbanding lurus dengan Δx.',
          'Perilaku dinamis: pegas + massa dapat menghasilkan GHS dengan ω = √(k/m).',
        ],
      },
      {
        heading: 'Aplikasi Singkat',
        text: 'Pegas dipakai pada suspensi kendaraan, perangkat mekanik, jam-jam tertentu, serta berbagai perangkat elektronika dan alat pengukur.',
      },
    ],
  },
];

const getYouTubeVideoId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
};

const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

export default function MateriScreen() {
  const [selectedMateri, setSelectedMateri] = useState('getaran');
  const [readModules, setReadModules] = useState({});
  const [userId, setUserId] = useState(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentMateri = MATERI_DATA.find((m) => m.id === selectedMateri);

  // Load progress from Supabase
  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from('profile')
        .select('materi_progress')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading progress:', error);
        return;
      }

      if (data && data.materi_progress) {
        const progress = data.materi_progress;
        const readState = {};
        if (progress.getaran) readState['getaran'] = true;
        if (progress.ghs) readState['ghs'] = true;
        if (progress.bandul) readState['bandul'] = true;
        if (progress.pegas) readState['pegas'] = true;
        setReadModules(readState);
      }
    } catch (error) {
      console.error('Exception loading progress:', error);
    }
  };

  // Save progress to Supabase
  const saveProgress = async (newReadModules) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user logged in');
        return;
      }

      const progress = {
        getaran: newReadModules['getaran'] || false,
        ghs: newReadModules['ghs'] || false,
        bandul: newReadModules['bandul'] || false,
        pegas: newReadModules['pegas'] || false,
      };

      console.log('💾 Saving progress:', progress);

      const { error } = await supabase
        .from('profile')
        .update({ materi_progress: progress })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Error saving progress:', error);
      } else {
        console.log('✅ Progress saved successfully');
      }
    } catch (error) {
      console.error('❌ Exception saving progress:', error);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const openVideo = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open video:', err)
    );
  };

  const markAsRead = async (id) => {
    const newState = { ...readModules };
    if (newState[id]) {
      delete newState[id];
    } else {
      newState[id] = true;
    }
    setReadModules(newState);
    await saveProgress(newState);
  };

  const calculateProgress = () => {
    const total = MATERI_DATA.length;
    const read = Object.keys(readModules).length;
    return total > 0 ? Math.round((read / total) * 100) : 0;
  };

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: calculateProgress(),
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [readModules]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Materi Pembelajaran</Text>
          <Text style={styles.headerSubtitle}>
            Pelajari konsep Gerak Harmonik Sederhana
          </Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progress Membaca</Text>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={['#7c3aed', '#06b6d4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressGradient}
              />
            </Animated.View>
          </View>
          <Text style={styles.progressText}>
            {calculateProgress()}% selesai
          </Text>
        </View>

        {/* Materi List */}
        <View style={styles.materiList}>
          {MATERI_DATA.map((materi) => (
            <TouchableOpacity
              key={materi.id}
              style={[
                styles.materiButton,
                selectedMateri === materi.id && styles.materiButtonActive,
              ]}
              onPress={() => setSelectedMateri(materi.id)}
            >
              <View style={styles.materiButtonContent}>
                <Text
                  style={[
                    styles.materiButtonText,
                    selectedMateri === materi.id &&
                      styles.materiButtonTextActive,
                  ]}
                >
                  {materi.title}
                </Text>
                {readModules[materi.id] && (
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Materi Content */}
        {currentMateri && (
          <View style={styles.contentCard}>
            <View style={styles.contentHeader}>
              <View style={styles.contentHeaderText}>
                <Text style={styles.contentTitle}>{currentMateri.title}</Text>
                <Text style={styles.contentSubtitle}>
                  {currentMateri.subtitle}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.markReadButton,
                  readModules[currentMateri.id] && styles.markReadButtonRead,
                ]}
                onPress={() => markAsRead(currentMateri.id)}
              >
                <Text
                  style={[
                    styles.markReadButtonText,
                    readModules[currentMateri.id] && styles.markReadButtonTextRead,
                  ]}
                >
                  {readModules[currentMateri.id] ? 'Sudah Dibaca' : 'Tandai Dibaca'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Video Embed */}
            <TouchableOpacity
              style={styles.videoContainer}
              onPress={() => openVideo(currentMateri.videoUrl)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: getYouTubeThumbnail(currentMateri.videoUrl) }}
                style={styles.videoThumbnail}
                resizeMode="cover"
              />
              <View style={styles.videoPlayOverlay}>
                <Ionicons name="play-circle" size={64} color="#ffffff" />
              </View>
              <View style={styles.videoCaption}>
                <Ionicons name="logo-youtube" size={20} color="#ef4444" />
                <Text style={styles.videoCaptionText}>
                  Penjelasan lengkap {currentMateri.title}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Content Sections */}
            <View style={styles.contentBody}>
              {currentMateri.content.map((section, index) => (
                <View key={index} style={styles.contentSection}>
                  <Text style={styles.sectionHeading}>{section.heading}</Text>
                  {section.text && (
                    <Text style={styles.sectionText}>{section.text}</Text>
                  )}
                  {section.list && (
                    <View style={styles.listContainer}>
                      {section.list.map((item, idx) => (
                        <View key={idx} style={styles.listItem}>
                          <Text style={styles.listBullet}>•</Text>
                          <Text style={styles.listText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

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
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e9d5ff',
  },
  progressCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e6eefc',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 999,
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
  },
  materiList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  materiButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  materiButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  materiButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  materiButtonText: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  materiButtonTextActive: {
    color: '#ffffff',
  },
  contentCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentHeader: {
    marginBottom: 20,
  },
  contentHeaderText: {
    marginBottom: 12,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  markReadButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  markReadButtonRead: {
    backgroundColor: '#94a3b8',
  },
  markReadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  markReadButtonTextRead: {
    color: '#f1f5f9',
  },
  videoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  videoThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  videoPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f4ff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  videoCaptionText: {
    fontSize: 13,
    color: '#64748b',
    flex: 1,
  },
  contentBody: {
    gap: 20,
  },
  contentSection: {
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
  },
  listBullet: {
    fontSize: 14,
    color: '#7c3aed',
    fontWeight: '700',
  },
  listText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    flex: 1,
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
