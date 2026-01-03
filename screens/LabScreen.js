import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabaseClient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function LabScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState('pegas'); // 'pegas' or 'bandul'
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [materiProgress, setMateriProgress] = useState(0);
  const [showLockModal, setShowLockModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const animValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  // Pegas parameters
  const [massa, setMassa] = useState(1.0);
  const [k, setK] = useState(10.0);
  const [amplitudo, setAmplitudo] = useState(0.5);

  // Bandul parameters
  const [L, setL] = useState(1.0);
  const [g, setG] = useState(9.81);
  const [theta, setTheta] = useState(10);

  // Load progress from Supabase
  const loadProgress = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('⚠️ No user logged in');
        setIsLoading(false);
        return;
      }

      console.log('📊 Loading progress for user:', user.id);

      const { data, error } = await supabase
        .from('profile')
        .select('materi_progress')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('❌ Error loading progress:', error);
        setMateriProgress(0);
        setShowLockModal(true);
        setIsLoading(false);
        return;
      }

      console.log('📥 Data loaded:', data);

      if (data && data.materi_progress) {
        const progress = data.materi_progress;
        let readCount = 0;
        if (progress.getaran) readCount++;
        if (progress.ghs) readCount++;
        if (progress.bandul) readCount++;
        if (progress.pegas) readCount++;
        const percentage = Math.round((readCount / 4) * 100);
        
        console.log(`📈 Progress: ${percentage}% (${readCount}/4 materi)`);
        setMateriProgress(percentage);
        
        if (percentage < 100) {
          console.log('🔒 Lab locked - showing modal');
          setShowLockModal(true);
        } else {
          console.log('🔓 Lab unlocked');
          setShowLockModal(false);
        }
      } else {
        console.log('📭 No progress data - showing modal');
        setMateriProgress(0);
        setShowLockModal(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Exception loading progress:', error);
      setMateriProgress(0);
      setShowLockModal(true);
      setIsLoading(false);
    }
  };

  // Load progress when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadProgress();
    }, [])
  );

  const calculatePegasResults = () => {
    const omega = Math.sqrt(k / massa);
    const T = (2 * Math.PI) / omega;
    const f = 1 / T;
    
    // Final position after 5 complete periods - returns to initial position
    const x = amplitudo; // At maximum displacement (starting position)
    const v = 0; // Velocity is zero at maximum displacement
    const a = -(omega * omega) * amplitudo; // Maximum acceleration at max displacement
    
    // Energy calculations at maximum displacement
    const EP = 0.5 * k * amplitudo * amplitudo; // All energy is potential at max displacement
    const EK = 0; // No kinetic energy at max displacement
    const ET = EP + EK;
    
    return { 
      T: T.toFixed(3), 
      f, 
      omega: omega.toFixed(3),
      posisi: x.toFixed(3) + ' m',
      kecepatan: v.toFixed(3) + ' m/s',
      percepatan: a.toFixed(3) + ' m/s²',
      EP: EP.toFixed(3) + ' J',
      EK: EK.toFixed(3) + ' J',
      ET: ET.toFixed(3) + ' J'
    };
  };

  const calculateBandulResults = () => {
    const T = 2 * Math.PI * Math.sqrt(L / g);
    const f = 1 / T;
    const omega = Math.sqrt(g / L);
    
    // Final position after 5 complete periods - returns to initial position
    const thetaRad = theta * Math.PI / 180; // At maximum angle (starting position)
    const v = 0; // Velocity is zero at maximum angle
    const a = -(omega * omega) * thetaRad * L; // Tangential acceleration at max angle
    
    // Energy calculations at maximum angle
    const h = L * (1 - Math.cos(thetaRad));
    const m = 1; // Assume 1 kg for bandul
    const EP = m * g * h; // All energy is potential at max angle
    const EK = 0; // No kinetic energy at max angle
    const ET = EP + EK;
    
    return { 
      T: T.toFixed(3), 
      f, 
      omega: omega.toFixed(3),
      posisi: (thetaRad * 180 / Math.PI).toFixed(2) + ' °',
      kecepatan: v.toFixed(3) + ' m/s',
      percepatan: a.toFixed(3) + ' m/s²',
      EP: EP.toFixed(3) + ' J',
      EK: EK.toFixed(3) + ' J',
      ET: ET.toFixed(3) + ' J'
    };
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    setShowResult(false);
    animValue.setValue(0);
    
    // Calculate period based on physics
    const T = mode === 'pegas' 
      ? (2 * Math.PI * Math.sqrt(massa / k)) * 1000 // Convert to ms
      : (2 * Math.PI * Math.sqrt(L / g)) * 1000;
    
    // Animasi oscillation with real period
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: T / 2,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: T / 2,
          useNativeDriver: true,
        }),
      ])
    );
    animationRef.current.start();
    
    // Auto complete after 5 complete periods
    setTimeout(() => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      setShowResult(true);
      setIsRunning(false);
      setIsPaused(false);
    }, T * 5);
  };

  const handlePause = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      if (animationRef.current) {
        animationRef.current.start();
      }
    } else {
      // Pause
      setIsPaused(true);
      if (animationRef.current) {
        animationRef.current.stop();
      }
    }
  };

  const handleSkip = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    setShowResult(true);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleReset = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    setIsRunning(false);
    setIsPaused(false);
    setShowResult(false);
    animValue.setValue(0);
    if (mode === 'pegas') {
      setMassa(1.0);
      setK(10.0);
      setAmplitudo(0.5);
    } else {
      setL(1.0);
      setG(9.81);
      setTheta(10);
    }
  };

  const results = mode === 'pegas' ? calculatePegasResults() : calculateBandulResults();

  return (
    <View style={styles.container}>
      {/* Lock Modal */}
      <Modal
        visible={showLockModal && !isLoading}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Icon */}
            <View style={styles.modalIconContainer}>
              <Ionicons name="lock-closed" size={60} color="#7c3aed" />
            </View>

            <Text style={styles.modalTitle}>Lab Terkunci</Text>
            <Text style={styles.modalMessage}>
              Selesaikan semua materi (100%) untuk membuka PhySphere Lab.
            </Text>
            <Text style={styles.modalProgress}>
              Progress saat ini: {materiProgress}%
            </Text>
            
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => {
                setShowLockModal(false);
                navigation.navigate('Materi');
              }}
            >
              <LinearGradient
                colors={['#7c3aed', '#a855f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>Ke Materi</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PhySphere Lab</Text>
          <Text style={styles.headerSubtitle}>Simulasi Interaktif Gerak Harmonik</Text>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeCard}>
          <Text style={styles.modeLabel}>Mode</Text>
          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'pegas' && styles.modeButtonActive]}
              onPress={() => {
                setMode('pegas');
                handleReset();
              }}
            >
              <Text style={[styles.modeButtonText, mode === 'pegas' && styles.modeButtonTextActive]}>
                Pegas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'bandul' && styles.modeButtonActive]}
              onPress={() => {
                setMode('bandul');
                handleReset();
              }}
            >
              <Text style={[styles.modeButtonText, mode === 'bandul' && styles.modeButtonTextActive]}>
                Bandul
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Parameters Card */}
        <View style={styles.parametersCard}>
          <Text style={styles.parametersTitle}>Parameter</Text>

          {mode === 'pegas' ? (
            <>
              <View style={styles.sliderGroup}>
                <Text style={styles.sliderLabel}>
                  Massa: <Text style={styles.sliderValue}>{massa.toFixed(2)} kg</Text>
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0.1}
                  maximumValue={5}
                  step={0.1}
                  value={massa}
                  onValueChange={setMassa}
                  minimumTrackTintColor="#7c3aed"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#7c3aed"
                />
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.sliderLabel}>
                  Konstanta Pegas (k): <Text style={styles.sliderValue}>{k.toFixed(2)} N/m</Text>
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={50}
                  step={1}
                  value={k}
                  onValueChange={setK}
                  minimumTrackTintColor="#7c3aed"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#7c3aed"
                />
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.sliderLabel}>
                  Amplitudo: <Text style={styles.sliderValue}>{amplitudo.toFixed(2)} m</Text>
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0.01}
                  maximumValue={1.5}
                  step={0.01}
                  value={amplitudo}
                  onValueChange={setAmplitudo}
                  minimumTrackTintColor="#7c3aed"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#7c3aed"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.sliderGroup}>
                <Text style={styles.sliderLabel}>
                  Panjang Tali (L): <Text style={styles.sliderValue}>{L.toFixed(2)} m</Text>
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0.1}
                  maximumValue={5}
                  step={0.1}
                  value={L}
                  onValueChange={setL}
                  minimumTrackTintColor="#7c3aed"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#7c3aed"
                />
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.sliderLabel}>
                  Percepatan Gravitasi (g): <Text style={styles.sliderValue}>{g.toFixed(2)} m/s²</Text>
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={20}
                  step={0.01}
                  value={g}
                  onValueChange={setG}
                  minimumTrackTintColor="#7c3aed"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#7c3aed"
                />
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.sliderLabel}>
                  Sudut Awal (θ): <Text style={styles.sliderValue}>{theta}°</Text>
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={45}
                  step={1}
                  value={theta}
                  onValueChange={setTheta}
                  minimumTrackTintColor="#7c3aed"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#7c3aed"
                />
              </View>
            </>
          )}

          <Text style={styles.tipText}>
            Gunakan tombol kontrol untuk menjalankan simulasi.
          </Text>
        </View>

        {/* Visualization */}
        <View style={styles.visualizationCard}>
          <LinearGradient
            colors={['#1e293b', '#334155']}
            style={[
              styles.canvas,
              mode === 'bandul' && { height: Math.max(300, L * 50 + 200) }
            ]}
          >
            <View style={styles.canvasContent}>
              {mode === 'pegas' ? (
                <View style={styles.pegasContainer}>
                  <View style={styles.pegasTop} />
                  <Animated.View
                    style={[
                      styles.pegasSpring,
                      {
                        transform: [
                          {
                            translateY: animValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, Math.min(amplitudo * 60, 120)], // Limit max movement
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    {[...Array(10)].map((_, i) => (
                      <View key={i} style={styles.springCoil} />
                    ))}
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.pegasMass,
                      {
                        width: 40 + massa * 8, // Size based on mass
                        height: 40 + massa * 8,
                        transform: [
                          {
                            translateY: animValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, Math.min(amplitudo * 60, 120)],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Text style={styles.massText}>m</Text>
                  </Animated.View>
                </View>
              ) : (
                <View style={styles.bandulContainer}>
                  <Animated.View
                    style={[
                      styles.bandulStringWrapper,
                      {
                        height: Math.min(L * 40, 200) + 20, // Limit max length
                        transform: [
                          {
                            rotate: animValue.interpolate({
                              inputRange: [0, 0.5, 1],
                              outputRange: [`-${theta}deg`, `${theta}deg`, `-${theta}deg`],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <View style={[styles.bandulString, { height: Math.min(L * 40, 200) }]} />
                    <View style={styles.bandulBob} />
                  </Animated.View>
                </View>
              )}
              {isRunning && (
                <View style={styles.canvasTextContainer}>
                  <Text style={styles.canvasText}>
                    {isPaused ? 'Simulasi dijeda' : 'Simulasi berjalan...'}
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlCard}>
          <Text style={styles.controlTitle}>Kontrol Simulasi</Text>
          <Text style={styles.controlSubtitle}>
            Mulai simulasi; hasil akan ditampilkan setelah selesai.
          </Text>

          <TouchableOpacity
            style={[styles.controlButton, styles.startButton]}
            onPress={handleStart}
            disabled={isRunning && !isPaused}
          >
            <Ionicons name="play" size={20} color="#ffffff" />
            <Text style={styles.controlButtonText}>Mulai</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.skipButton]}
            onPress={handleSkip}
            disabled={!isRunning}
          >
            <Ionicons name="play-skip-forward" size={20} color="#ffffff" />
            <Text style={styles.controlButtonText}>Skip (Lompat ke Akhir)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton]}
            onPress={handlePause}
            disabled={!isRunning}
          >
            <Ionicons name={isPaused ? "play" : "pause"} size={20} color="#ffffff" />
            <Text style={styles.controlButtonText}>{isPaused ? 'Lanjutkan' : 'Jeda'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={20} color="#ffffff" />
            <Text style={styles.controlButtonText}>Reset</Text>
          </TouchableOpacity>

          <Text style={styles.tipTextSmall}>
            Tips: Atur parameter sebelum memulai.
          </Text>
        </View>

        {/* Results */}
        {showResult && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Hasil Simulasi</Text>
            <Text style={styles.resultSubtitle}>
              Hasil akhir simulasi akan muncul di sini setelah simulasi selesai.
            </Text>

            <View style={styles.resultContent}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Mode:</Text>
                <Text style={[styles.resultValue, styles.resultBold]}>
                  {mode === 'pegas' ? 'Pegas' : 'Bandul'}
                </Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Periode (T):</Text>
                <Text style={styles.resultValue}>{results.T} s</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Frekuensi Sudut (ω):</Text>
                <Text style={styles.resultValue}>{results.omega} rad/s</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Posisi Akhir:</Text>
                <Text style={styles.resultValue}>{results.posisi}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Kecepatan Akhir:</Text>
                <Text style={styles.resultValue}>{results.kecepatan}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Percepatan Akhir:</Text>
                <Text style={styles.resultValue}>{results.percepatan}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Energi Potensial (EP):</Text>
                <Text style={styles.resultValue}>{results.EP}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Energi Kinetik (EK):</Text>
                <Text style={styles.resultValue}>{results.EK}</Text>
              </View>
              <View style={[styles.resultRow, styles.resultRowBold]}>
                <Text style={[styles.resultLabel, styles.resultBold]}>Energi Total (ET):</Text>
                <Text style={[styles.resultValue, styles.resultBold]}>{results.ET}</Text>
              </View>
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
  modeCard: {
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
  modeLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  parametersCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  parametersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
  },
  sliderGroup: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  sliderValue: {
    fontWeight: '700',
    color: '#7c3aed',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  tipText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 8,
  },
  tipTextSmall: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 12,
  },
  visualizationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  canvas: {
    width: '100%',
    minHeight: 300,
  },
  canvasContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    position: 'relative',
  },
  pegasContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  pegasTop: {
    width: 100,
    height: 8,
    backgroundColor: '#64748b',
    borderRadius: 4,
  },
  pegasSpring: {
    width: 40,
    paddingVertical: 4,
  },
  springCoil: {
    width: 40,
    height: 12,
    borderWidth: 2,
    borderColor: '#7c3aed',
    borderRadius: 20,
    marginVertical: 1,
  },
  pegasMass: {
    width: 60,
    height: 60,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  massText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  bandulContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    width: '100%',
  },
  bandulStringWrapper: {
    alignItems: 'center',
  },
  bandulString: {
    width: 2,
    backgroundColor: '#e2e8f0',
  },
  bandulBob: {
    width: 32,
    height: 32,
    backgroundColor: '#06b6d4',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
    marginTop: -2,
  },
  canvasTextContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  canvasText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controlCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  controlSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#10b981',
  },
  skipButton: {
    backgroundColor: '#6366f1',
  },
  pauseButton: {
    backgroundColor: '#f59e0b',
  },
  resetButton: {
    backgroundColor: '#ef4444',
  },
  controlButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  resultContent: {
    gap: 6,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  resultRowBold: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  resultLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  resultBold: {
    fontWeight: '700',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 40,
    paddingHorizontal: 32,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 60,
    elevation: 10,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  modalProgress: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtonPrimary: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
});

