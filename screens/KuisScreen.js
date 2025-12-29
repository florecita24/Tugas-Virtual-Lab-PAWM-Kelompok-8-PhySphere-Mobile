import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const QUIZ_DATA = {
  getaran: {
    title: 'Getaran & Gelombang',
    icon: 'pulse',
    questions: [
      {
        type: 'mcq',
        question: 'Gelombang longitudinal memiliki getaran pada arah?',
        options: ['Sejajar arah rambat', 'Tegak lurus arah rambat', 'Melingkar', 'Mundar'],
        correct: 'Sejajar arah rambat',
        explanation: 'Gelombang longitudinal memiliki getaran partikel medium sejajar arah rambat gelombang, contohnya gelombang bunyi.',
      },
      {
        type: 'order',
        question: 'Urutkan tahap dasar analisis gelombang',
        items: ['Tentukan periode/ frekuensi', 'Identifikasi medium', 'Tuliskan persamaan gelombang', 'Analisis perambatan'],
        correct: ['Identifikasi medium', 'Tuliskan persamaan gelombang', 'Tentukan periode/ frekuensi', 'Analisis perambatan'],
        explanation: 'Langkah awal biasanya mengenali medium dan sifatnya, kemudian menulis persamaan, menentukan periode/frekuensi, lalu menganalisis perambatan.',
      },
      {
        type: 'short',
        question: 'Satuan frekuensi (tulis singkat)',
        correct: 'Hz',
        explanation: 'Frekuensi diukur dalam Hertz (Hz), yaitu jumlah getaran per detik.',
      },
    ],
  },
  ghs: {
    title: 'GHS',
    icon: 'stats-chart',
    questions: [
      {
        type: 'mcq',
        question: 'Pada GHS ideal, periode T bergantung pada?',
        options: ['Amplitudo', 'Massa dan konstanta pegas', 'Hanya massa', 'Warna pegas'],
        correct: 'Massa dan konstanta pegas',
        explanation: 'Periode GHS pada pegas tergantung pada massa m dan konstanta pegas k: T = 2π√(m/k).',
      },
      {
        type: 'order',
        question: 'Urutkan turunan dari simpangan untuk mendapatkan percepatan',
        items: ['y(t)', 'v(t)', 'a(t)'],
        correct: ['y(t)', 'v(t)', 'a(t)'],
        explanation: 'Percepatan adalah turunan kedua dari posisi y(t): y → v (turunan pertama) → a (turunan kedua).',
      },
      {
        type: 'short',
        question: 'Tuliskan simbol konstanta pegas',
        correct: 'k',
        explanation: 'Konstanta pegas biasanya dilambangkan dengan huruf k dalam hukum Hooke.',
      },
    ],
  },
  bandul: {
    title: 'Bandul',
    icon: 'ellipse',
    questions: [
      {
        type: 'mcq',
        question: 'Periode bandul ideal bergantung pada?',
        options: ['Massa', 'Panjang tali', 'Amplitudo besar', 'Warna'],
        correct: 'Panjang tali',
        explanation: 'Untuk bandul sederhana pada sudut kecil, periode bergantung pada panjang tali L dan percepatan gravitasi g: T = 2π√(L/g).',
      },
      {
        type: 'order',
        question: 'Urutkan analisis bandul untuk menemukan periode',
        items: ['Tuliskan gaya tangensial', 'Linearize untuk sudut kecil', 'Tulis persamaan gerak', 'Hitung perioda'],
        correct: ['Tuliskan gaya tangensial', 'Tulis persamaan gerak', 'Linearize untuk sudut kecil', 'Hitung perioda'],
        explanation: 'Analisis bandul dimulai dari gaya tangensial, menuliskan persamaan gerak, melakukan linearization untuk sudut kecil, lalu menghitung periode.',
      },
      {
        type: 'short',
        question: 'Satuan periode T (singkat)',
        correct: 's',
        explanation: 'Periode diukur dalam satuan waktu, yaitu detik (s).',
      },
    ],
  },
  pegas: {
    title: 'Pegas',
    icon: 'git-compare',
    questions: [
      {
        type: 'mcq',
        question: 'Hukum Hooke menyatakan gaya berbanding lurus dengan?',
        options: ['Kecepatan', 'Percepatan', 'Perubahan panjang Δx', 'Massa'],
        correct: 'Perubahan panjang Δx',
        explanation: 'Hukum Hooke menyatakan F = -k Δx, jadi gaya berbanding lurus dengan perubahan panjang pegas Δx.',
      },
      {
        type: 'order',
        question: 'Urutkan langkah analisis pegas: dari gaya ke periode',
        items: ['Tentukan gaya pemulih', 'Tulis persamaan gerak', 'Cari solusi harmonik', 'Hitung T'],
        correct: ['Tentukan gaya pemulih', 'Tulis persamaan gerak', 'Cari solusi harmonik', 'Hitung T'],
        explanation: 'Analisis dimulai dari gaya pemulih (Hooke), menulis persamaan gerak, mencari solusi harmonik, lalu menghitung periode.',
      },
      {
        type: 'short',
        question: 'Jika k=10 N/m dan m=1 kg, berapa ω (rad/s)? (angka saja)',
        correct: '3.162',
        explanation: 'Untuk pegas, ω = √(k/m). Dengan k=10 dan m=1, ω ≈ √10 ≈ 3.162.',
      },
    ],
  },
};

export default function KuisScreen() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isStarted && !showResult) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, showResult]);

  const handleStartQuiz = (topic) => {
    setSelectedTopic(topic);
    setIsStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(120);
    setShowResult(false);
    setScore(0);
  };

  const handleRetry = () => {
    setIsStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(120);
    setShowResult(false);
    setScore(0);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setIsStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(120);
    setShowResult(false);
    setScore(0);
  };

  const handleAnswer = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const quiz = QUIZ_DATA[selectedTopic];
    let correct = 0;
    
    quiz.questions.forEach((q, idx) => {
      const userAnswer = answers[idx];
      if (q.type === 'mcq') {
        if (userAnswer === q.correct) correct++;
      } else if (q.type === 'short') {
        if (userAnswer && userAnswer.toLowerCase().trim() === q.correct.toLowerCase().trim()) correct++;
      } else if (q.type === 'order') {
        if (userAnswer && JSON.stringify(userAnswer) === JSON.stringify(q.correct)) correct++;
      }
    });
    
    setScore(correct);
    setShowResult(true);
  };

  const moveItem = (questionIndex, fromIdx, toIdx) => {
    const currentAnswer = answers[questionIndex] || QUIZ_DATA[selectedTopic].questions[questionIndex].items;
    const newOrder = [...currentAnswer];
    const [moved] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, moved);
    handleAnswer(questionIndex, newOrder);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!selectedTopic) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>PhySphere Quiz</Text>
            <Text style={styles.headerSubtitle}>Uji pemahaman Anda tentang Gerak Harmonik</Text>
          </View>

          {/* Topics */}
          <View style={styles.topicsContainer}>
            <Text style={styles.sectionTitle}>Pilih Topik Kuis</Text>
            {Object.keys(QUIZ_DATA).map((key) => {
              const topic = QUIZ_DATA[key];
              return (
                <TouchableOpacity
                  key={key}
                  style={styles.topicCard}
                  onPress={() => handleStartQuiz(key)}
                >
                  <View style={styles.topicContent}>
                    <Ionicons name={topic.icon} size={32} color="#7c3aed" />
                    <View style={styles.topicInfo}>
                      <Text style={styles.topicTitle}>{topic.title}</Text>
                      <Text style={styles.topicSubtitle}>
                        {topic.questions.length} Soal • 2 Menit
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#7c3aed" />
                  </View>
                </TouchableOpacity>
              );
            })}
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

  const quiz = QUIZ_DATA[selectedTopic];
  const currentQ = quiz.questions[currentQuestion];

  if (showResult) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Hasil Kuis</Text>
            <Text style={styles.headerSubtitle}>{quiz.title}</Text>
          </View>

          <View style={styles.resultCard}>
            <LinearGradient
              colors={passed ? ['#10b981', '#059669'] : ['#ef4444', '#dc2626']}
              style={styles.resultGradient}
            >
              <Ionicons
                name={passed ? 'checkmark-circle' : 'close-circle'}
                size={80}
                color="#ffffff"
              />
              <Text style={styles.resultTitle}>
                {passed ? 'Lulus!' : 'Belum Lulus'}
              </Text>
              <Text style={styles.resultScore}>
                {score} / {quiz.questions.length}
              </Text>
              <Text style={styles.resultPercentage}>{percentage}%</Text>
            </LinearGradient>

            {/* Review Answers */}
            <View style={styles.reviewSection}>
              <Text style={styles.reviewTitle}>Pembahasan</Text>
              {quiz.questions.map((q, idx) => {
                const userAnswer = answers[idx];
                let isCorrect = false;
                
                if (q.type === 'mcq') {
                  isCorrect = userAnswer === q.correct;
                } else if (q.type === 'short') {
                  isCorrect = userAnswer && userAnswer.toLowerCase().trim() === q.correct.toLowerCase().trim();
                } else if (q.type === 'order') {
                  isCorrect = userAnswer && JSON.stringify(userAnswer) === JSON.stringify(q.correct);
                }

                return (
                  <View key={idx} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewNumber}>Soal {idx + 1}</Text>
                      <Ionicons
                        name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                        size={24}
                        color={isCorrect ? '#10b981' : '#ef4444'}
                      />
                    </View>
                    <Text style={styles.reviewQuestion}>{q.question}</Text>
                    
                    {q.type === 'mcq' && (
                      <>
                        <Text style={styles.reviewLabel}>Jawaban Anda:</Text>
                        <Text style={[styles.reviewAnswer, !isCorrect && styles.reviewAnswerWrong]}>
                          {userAnswer || 'Tidak dijawab'}
                        </Text>
                        {!isCorrect && (
                          <>
                            <Text style={styles.reviewLabel}>Jawaban Benar:</Text>
                            <Text style={styles.reviewAnswerCorrect}>{q.correct}</Text>
                          </>
                        )}
                      </>
                    )}
                    
                    {q.type === 'short' && (
                      <>
                        <Text style={styles.reviewLabel}>Jawaban Anda:</Text>
                        <Text style={[styles.reviewAnswer, !isCorrect && styles.reviewAnswerWrong]}>
                          {userAnswer || 'Tidak dijawab'}
                        </Text>
                        {!isCorrect && (
                          <>
                            <Text style={styles.reviewLabel}>Jawaban Benar:</Text>
                            <Text style={styles.reviewAnswerCorrect}>{q.correct}</Text>
                          </>
                        )}
                      </>
                    )}
                    
                    {q.type === 'order' && (
                      <>
                        <Text style={styles.reviewLabel}>Urutan Anda:</Text>
                        <View style={styles.orderPreview}>
                          {(userAnswer || []).map((item, i) => (
                            <Text key={i} style={styles.orderItem}>
                              {i + 1}. {item}
                            </Text>
                          ))}
                        </View>
                        {!isCorrect && (
                          <>
                            <Text style={styles.reviewLabel}>Urutan Benar:</Text>
                            <View style={styles.orderPreview}>
                              {q.correct.map((item, i) => (
                                <Text key={i} style={[styles.orderItem, styles.orderItemCorrect]}>
                                  {i + 1}. {item}
                                </Text>
                              ))}
                            </View>
                          </>
                        )}
                      </>
                    )}
                    
                    <Text style={styles.explanation}>{q.explanation}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.resultButtons}>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Ionicons name="refresh" size={20} color="#ffffff" />
                <Text style={styles.retryButtonText}>Ulangi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={handleBackToTopics}>
                <Ionicons name="arrow-back" size={20} color="#7c3aed" />
                <Text style={styles.backButtonText}>Kembali</Text>
              </TouchableOpacity>
            </View>
          </View>

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with Timer */}
        <View style={styles.quizHeader}>
          <View style={styles.quizHeaderTop}>
            <TouchableOpacity onPress={handleBackToTopics}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <View style={styles.timerContainer}>
              <Ionicons name="time" size={20} color="#ffffff" />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>
          </View>
          <Text style={styles.questionProgress}>
            Soal {currentQuestion + 1} dari {quiz.questions.length}
          </Text>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQ.question}</Text>

          {currentQ.type === 'mcq' && (
            <View style={styles.optionsContainer}>
              {currentQ.options.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.optionButton,
                    answers[currentQuestion] === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleAnswer(currentQuestion, option)}
                >
                  <View style={styles.radioButton}>
                    {answers[currentQuestion] === option && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      answers[currentQuestion] === option && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {currentQ.type === 'short' && (
            <TextInput
              style={styles.shortInput}
              placeholder="Tulis jawaban singkat..."
              value={answers[currentQuestion] || ''}
              onChangeText={(text) => handleAnswer(currentQuestion, text)}
            />
          )}

          {currentQ.type === 'order' && (
            <View style={styles.orderContainer}>
              <Text style={styles.orderInstruction}>
                Tekan dan tahan untuk menggeser urutan
              </Text>
              {(answers[currentQuestion] || currentQ.items).map((item, idx) => (
                <View key={idx} style={styles.orderItemContainer}>
                  <Text style={styles.orderNumber}>{idx + 1}</Text>
                  <View style={styles.orderItemContent}>
                    <Text style={styles.orderItemText}>{item}</Text>
                    <View style={styles.orderControls}>
                      {idx > 0 && (
                        <TouchableOpacity
                          onPress={() => moveItem(currentQuestion, idx, idx - 1)}
                          style={styles.orderButton}
                        >
                          <Ionicons name="arrow-up" size={20} color="#7c3aed" />
                        </TouchableOpacity>
                      )}
                      {idx < (answers[currentQuestion] || currentQ.items).length - 1 && (
                        <TouchableOpacity
                          onPress={() => moveItem(currentQuestion, idx, idx + 1)}
                          style={styles.orderButton}
                        >
                          <Ionicons name="arrow-down" size={20} color="#7c3aed" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentQuestion > 0 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentQuestion(currentQuestion - 1)}
            >
              <Ionicons name="arrow-back" size={20} color="#7c3aed" />
              <Text style={styles.navButtonText}>Sebelumnya</Text>
            </TouchableOpacity>
          )}
          
          {currentQuestion < quiz.questions.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonPrimary]}
              onPress={() => setCurrentQuestion(currentQuestion + 1)}
            >
              <Text style={styles.navButtonTextPrimary}>Selanjutnya</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonSubmit]}
              onPress={handleSubmit}
            >
              <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
              <Text style={styles.navButtonTextPrimary}>Kirim</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Question Navigator */}
        <View style={styles.questionNavigator}>
          <Text style={styles.navigatorTitle}>Navigasi Soal</Text>
          <View style={styles.questionDots}>
            {quiz.questions.map((_, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.questionDot,
                  idx === currentQuestion && styles.questionDotActive,
                  answers[idx] !== undefined && styles.questionDotAnswered,
                ]}
                onPress={() => setCurrentQuestion(idx)}
              >
                <Text
                  style={[
                    styles.questionDotText,
                    (idx === currentQuestion || answers[idx] !== undefined) && styles.questionDotTextActive,
                  ]}
                >
                  {idx + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
  topicsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  topicCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topicContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  topicSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  quizHeader: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 20,
  },
  quizHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    marginLeft: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  questionProgress: {
    fontSize: 14,
    color: '#e9d5ff',
  },
  questionCard: {
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
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    gap: 12,
  },
  optionButtonSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#f5f3ff',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7c3aed',
  },
  optionText: {
    fontSize: 15,
    color: '#64748b',
    flex: 1,
  },
  optionTextSelected: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  shortInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 16,
    fontSize: 15,
    color: '#1e293b',
  },
  orderContainer: {
    gap: 12,
  },
  orderInstruction: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  orderItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7c3aed',
    width: 30,
  },
  orderItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  orderItemText: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  orderControls: {
    flexDirection: 'column',
    gap: 4,
  },
  orderButton: {
    padding: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7c3aed',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  navButtonPrimary: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  navButtonSubmit: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7c3aed',
  },
  navButtonTextPrimary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  questionNavigator: {
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
  navigatorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  questionDots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  questionDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  questionDotActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#7c3aed',
  },
  questionDotAnswered: {
    borderColor: '#10b981',
    backgroundColor: '#dcfce7',
  },
  questionDotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  questionDotTextActive: {
    color: '#ffffff',
  },
  resultCard: {
    margin: 16,
  },
  resultGradient: {
    alignItems: 'center',
    paddingVertical: 40,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
  },
  resultPercentage: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 8,
  },
  reviewSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7c3aed',
  },
  reviewQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
  },
  reviewAnswer: {
    fontSize: 14,
    color: '#1e293b',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  reviewAnswerWrong: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  reviewAnswerCorrect: {
    fontSize: 14,
    color: '#059669',
    padding: 12,
    backgroundColor: '#d1fae5',
    borderRadius: 8,
    fontWeight: '600',
  },
  orderPreview: {
    gap: 8,
    marginTop: 4,
  },
  orderItem: {
    fontSize: 14,
    color: '#1e293b',
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
  },
  orderItemCorrect: {
    backgroundColor: '#d1fae5',
    color: '#059669',
  },
  explanation: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    lineHeight: 20,
  },
  resultButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7c3aed',
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7c3aed',
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
