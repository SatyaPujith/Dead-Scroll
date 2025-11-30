import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, BookOpen, DoorOpen, Zap, Heart, Loader } from 'lucide-react';

interface LearningQuestProps {
  onComplete: () => void;
  siteName: string;
}

interface ContentSection {
  title: string;
  content: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

type GameState = 'input' | 'generating' | 'reading' | 'combat' | 'victory';

export const LearningQuest: React.FC<LearningQuestProps> = ({ onComplete, siteName }) => {
  console.log('LearningQuest component rendered! siteName:', siteName);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [gameState, setGameState] = useState<GameState>('input');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [playerHealth, setPlayerHealth] = useState(3);
  const [ghostHealth, setGhostHealth] = useState(1);
  const [combatResult, setCombatResult] = useState<'correct' | 'wrong' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Halloween sound effects - play at specific moments only

  // Halloween sound effects - play at specific moments only
  const playSound = (type: 'correct' | 'wrong' | 'victory' | 'death') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (type === 'correct') {
        // Magical success chime
        const playNote = (freq: number, startTime: number, duration: number) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + startTime);
          gain.gain.setValueAtTime(0.2, audioContext.currentTime + startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.start(audioContext.currentTime + startTime);
          osc.stop(audioContext.currentTime + startTime + duration);
        };
        // Magical ascending arpeggio
        playNote(523.25, 0, 0.15);    // C5
        playNote(659.25, 0.1, 0.15);  // E5
        playNote(783.99, 0.2, 0.3);   // G5
        
      } else if (type === 'wrong') {
        // Evil laugh / cackle sound
        const laugh = audioContext.createOscillator();
        const laughGain = audioContext.createGain();
        laugh.type = 'sawtooth';
        
        // Create laughing pattern with frequency modulation
        laugh.frequency.setValueAtTime(200, audioContext.currentTime);
        laugh.frequency.linearRampToValueAtTime(300, audioContext.currentTime + 0.1);
        laugh.frequency.linearRampToValueAtTime(180, audioContext.currentTime + 0.2);
        laugh.frequency.linearRampToValueAtTime(280, audioContext.currentTime + 0.3);
        laugh.frequency.linearRampToValueAtTime(160, audioContext.currentTime + 0.4);
        laugh.frequency.linearRampToValueAtTime(250, audioContext.currentTime + 0.5);
        laugh.frequency.linearRampToValueAtTime(140, audioContext.currentTime + 0.6);
        
        // Volume envelope for laugh effect
        laughGain.gain.setValueAtTime(0, audioContext.currentTime);
        laughGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
        laughGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.15);
        laughGain.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.25);
        laughGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.35);
        laughGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.45);
        laughGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.6);
        
        laugh.connect(laughGain);
        laughGain.connect(audioContext.destination);
        laugh.start(audioContext.currentTime);
        laugh.stop(audioContext.currentTime + 0.6);
        
      } else if (type === 'victory') {
        // Triumphant fanfare
        const playChord = (freqs: number[], startTime: number, duration: number) => {
          freqs.forEach(freq => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioContext.currentTime + startTime);
            gain.gain.setValueAtTime(0.15, audioContext.currentTime + startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(audioContext.currentTime + startTime);
            osc.stop(audioContext.currentTime + startTime + duration);
          });
        };
        // Victory chord progression
        playChord([523.25, 659.25, 783.99], 0, 0.3);      // C major
        playChord([587.33, 739.99, 880.00], 0.25, 0.3);   // D major
        playChord([659.25, 830.61, 987.77], 0.5, 0.5);    // E major
        
      } else if (type === 'death') {
        // Ominous death sound with ghost wail
        const death1 = audioContext.createOscillator();
        const death2 = audioContext.createOscillator();
        const deathGain = audioContext.createGain();
        
        death1.type = 'sawtooth';
        death2.type = 'sine';
        
        // Deep ominous tone
        death1.frequency.setValueAtTime(110, audioContext.currentTime);
        death1.frequency.exponentialRampToValueAtTime(55, audioContext.currentTime + 0.8);
        
        // Ghost wail overlay
        death2.frequency.setValueAtTime(440, audioContext.currentTime);
        death2.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.4);
        death2.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.8);
        
        deathGain.gain.setValueAtTime(0.3, audioContext.currentTime);
        deathGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        death1.connect(deathGain);
        death2.connect(deathGain);
        deathGain.connect(audioContext.destination);
        
        death1.start(audioContext.currentTime);
        death2.start(audioContext.currentTime);
        death1.stop(audioContext.currentTime + 0.8);
        death2.stop(audioContext.currentTime + 0.8);
      }
    } catch (err) {
      console.log('Sound playback failed:', err);
    }
  };

  const generateContent = async () => {
    if (!topic.trim()) return;
    
    console.log('Starting content generation for topic:', topic);
    setIsGenerating(true);
    setError(null);
    setGameState('generating');

    try {
      // Get API key from environment variable only
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to .env.local file. See API_KEY_SETUP.md for instructions.');
      }

      const prompt = `Create an educational lesson about "${topic}" divided into 5 sections. Each section should teach something important about the topic, progressing from basics to advanced concepts.

For each section provide:
1. A short title (3-5 words)
2. Educational content (2-3 informative paragraphs explaining key concepts clearly)
3. A multiple choice quiz question with 4 options to test understanding

Format your response as valid JSON only (no markdown, no code blocks):
{
  "sections": [
    {
      "title": "Introduction to ${topic}",
      "content": "Paragraph 1 explaining basics...\\n\\nParagraph 2 with more details...",
      "quiz": {
        "question": "What is the main concept of ${topic}?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0
      }
    },
    {
      "title": "Fundamental Concepts",
      "content": "Detailed explanation...",
      "quiz": {
        "question": "Which statement is true?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 1
      }
    },
    {
      "title": "Core Principles",
      "content": "Core concepts...",
      "quiz": {
        "question": "How does this principle work?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 2
      }
    },
    {
      "title": "Advanced Applications",
      "content": "Advanced topics...",
      "quiz": {
        "question": "What is an advanced application?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 1
      }
    },
    {
      "title": "Expert Knowledge",
      "content": "Expert-level concepts...",
      "quiz": {
        "question": "What is the expert-level understanding?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": 3
      }
    }
  ]
}

Make the content educational, accurate, and progressively more challenging. The correctAnswer should be the index (0-3) of the correct option.`;

      console.log('Sending request to Gemini API...');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('API Response received:', data);
      const text = data.candidates[0].content.parts[0].text;
      console.log('Generated text:', text);
      
      // Extract JSON from response (remove markdown code blocks if present)
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/```$/, '');
      }
      
      console.log('Parsing JSON:', jsonText.substring(0, 200) + '...');
      const parsed = JSON.parse(jsonText);
      console.log('Parsed data:', parsed);
      
      if (!parsed.sections || parsed.sections.length === 0) {
        throw new Error('No content generated');
      }

      console.log('Content generated successfully! Sections:', parsed.sections.length);
      setSections(parsed.sections);
      setCurrentSection(0);
      setGameState('reading');
      setPlayerHealth(3);
      setGhostHealth(1);
    } catch (err) {
      console.error('Generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      console.error('Error message:', errorMessage);
      setError(errorMessage);
      setGameState('input');
    } finally {
      setIsGenerating(false);
      console.log('Generation process complete');
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (combatResult !== null) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === sections[currentSection].quiz.correctAnswer;
    setCombatResult(isCorrect ? 'correct' : 'wrong');
    
    // Play sound effect
    playSound(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      if (isCorrect) {
        setGhostHealth(0);
        setTimeout(() => {
          if (currentSection < sections.length - 1) {
            setCurrentSection(currentSection + 1);
            setGameState('reading');
            setSelectedAnswer(null);
            setCombatResult(null);
            setGhostHealth(1);
          } else {
            playSound('victory');
            setGameState('victory');
          }
        }, 1500);
      } else {
        setPlayerHealth(prev => prev - 1);
        setTimeout(() => {
          if (playerHealth - 1 <= 0) {
            playSound('death');
            setCurrentSection(0);
            setGameState('reading');
            setPlayerHealth(3);
            setGhostHealth(1);
            setSelectedAnswer(null);
            setCombatResult(null);
          } else {
            setGameState('combat');
            setSelectedAnswer(null);
            setCombatResult(null);
            setGhostHealth(1);
          }
        }, 1500);
      }
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(139, 0, 0, 0.1) 0%, transparent 50%)',
      color: '#e5e5e5',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 0, 0, 0.5) 2px, rgba(139, 0, 0, 0.5) 4px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.2, repeat: Infinity, ease: 'linear' }}
      />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {(gameState === 'input' || gameState === 'generating') && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '40px',
                textAlign: 'center'
              }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Brain size={80} color="#DC2626" />
              </motion.div>

              <h1 style={{
                fontSize: '48px',
                fontFamily: 'Creepster, cursive',
                color: '#DC2626',
                margin: '30px 0 20px 0',
                textShadow: '0 0 30px rgba(220, 38, 38, 0.8)'
              }}>
                LEARN TO ESCAPE
              </h1>

              <p style={{
                fontSize: '18px',
                color: '#9CA3AF',
                marginBottom: '40px',
                maxWidth: '600px'
              }}>
                To unlock <span style={{ color: '#DC2626', fontWeight: 'bold' }}>{siteName}</span>,
                you must complete an educational quest. Choose your topic wisely...
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    border: '2px solid #DC2626',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '20px',
                    color: '#FCA5A5',
                    maxWidth: '500px'
                  }}
                >
                  {error}
                </motion.div>
              )}

              <div style={{ width: '100%', maxWidth: '500px' }}>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isGenerating && generateContent()}
                  placeholder="Enter a topic (e.g., JavaScript, World War 2, Quantum Physics)"
                  disabled={isGenerating}
                  style={{
                    width: '100%',
                    padding: '20px',
                    fontSize: '18px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '2px solid #7F1D1D',
                    borderRadius: '12px',
                    color: '#e5e5e5',
                    outline: 'none',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}
                />

                <motion.button
                  onClick={() => {
                    console.log('BEGIN QUEST button clicked! Topic:', topic);
                    generateContent();
                  }}
                  disabled={!topic.trim() || isGenerating}
                  whileHover={{ scale: topic.trim() && !isGenerating ? 1.05 : 1 }}
                  whileTap={{ scale: topic.trim() && !isGenerating ? 0.95 : 1 }}
                  style={{
                    width: '100%',
                    padding: '20px',
                    fontSize: '24px',
                    fontFamily: 'Creepster, cursive',
                    backgroundColor: topic.trim() && !isGenerating ? '#DC2626' : '#374151',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: topic.trim() && !isGenerating ? 'pointer' : 'not-allowed',
                    opacity: topic.trim() && !isGenerating ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader className="animate-spin" size={24} />
                      SUMMONING KNOWLEDGE...
                    </>
                  ) : (
                    <>
                      <Zap size={24} />
                      BEGIN QUEST
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === 'reading' && sections[currentSection] && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              style={{
                minHeight: '100vh',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
                    Section {currentSection + 1} of {sections.length}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {Array.from({ length: playerHealth }).map((_, i) => (
                      <Heart key={i} size={20} color="#DC2626" fill="#DC2626" />
                    ))}
                  </div>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                    style={{
                      height: '100%',
                      backgroundColor: '#DC2626',
                      boxShadow: '0 0 10px rgba(220, 38, 38, 0.8)'
                    }}
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #7F1D1D',
                  borderRadius: '12px',
                  padding: '40px',
                  marginBottom: '20px',
                  maxHeight: '60vh',
                  overflowY: 'auto'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
                  <BookOpen size={32} color="#DC2626" />
                  <h2 style={{
                    fontSize: '32px',
                    fontFamily: 'Creepster, cursive',
                    color: '#DC2626',
                    margin: 0
                  }}>
                    {sections[currentSection].title}
                  </h2>
                </div>

                <div style={{
                  fontSize: '16px',
                  lineHeight: '1.8',
                  color: '#e5e5e5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {sections[currentSection].content}
                </div>
              </motion.div>

              <motion.button
                onClick={() => setGameState('combat')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '20px',
                  fontSize: '24px',
                  fontFamily: 'Creepster, cursive',
                  backgroundColor: '#DC2626',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(220, 38, 38, 0.5)'
                }}
              >
                FACE THE GHOST
              </motion.button>
            </motion.div>
          )}

          {gameState === 'combat' && sections[currentSection] && (
            <motion.div
              key="combat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                minHeight: '100vh',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginBottom: '60px'
              }}>
                <motion.div
                  animate={combatResult === 'wrong' ? { x: [0, -20, 0], opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  style={{ textAlign: 'center' }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontSize: '80px', marginBottom: '16px' }}
                  >
                    🧙‍♂️
                  </motion.div>
                  <div style={{ color: '#22C55E', fontWeight: 'bold', fontSize: '18px' }}>YOU</div>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '8px' }}>
                    {Array.from({ length: playerHealth }).map((_, i) => (
                      <Heart key={i} size={16} color="#DC2626" fill="#DC2626" />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '32px', fontFamily: 'Creepster, cursive', color: '#DC2626' }}
                >
                  VS
                </motion.div>

                <motion.div
                  animate={combatResult === 'correct' ? {
                    scale: [1, 1.5, 0],
                    opacity: [1, 1, 0],
                    rotate: [0, 0, 360]
                  } : combatResult === 'wrong' ? {
                    scale: [1, 1.3, 1],
                    x: [0, 20, 0]
                  } : {
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: combatResult ? 1 : 2, repeat: combatResult ? 0 : Infinity }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{
                    fontSize: '80px',
                    marginBottom: '16px',
                    filter: ghostHealth === 0 ? 'grayscale(1)' : 'none'
                  }}>
                    👻
                  </div>
                  <div style={{ color: '#DC2626', fontWeight: 'bold', fontSize: '18px' }}>GHOST</div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid #7F1D1D',
                  borderRadius: '12px',
                  padding: '30px'
                }}
              >
                <h3 style={{
                  fontSize: '20px',
                  color: '#DC2626',
                  marginBottom: '24px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  {sections[currentSection].quiz.question}
                </h3>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {sections[currentSection].quiz.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === sections[currentSection].quiz.correctAnswer;
                    const showResult = combatResult !== null;

                    let backgroundColor = '#1F2937';
                    let borderColor = '#374151';
                    let textColor = '#e5e5e5';

                    if (showResult && isSelected) {
                      if (combatResult === 'correct') {
                        backgroundColor = 'rgba(34, 197, 94, 0.2)';
                        borderColor = '#22C55E';
                        textColor = '#22C55E';
                      } else {
                        backgroundColor = 'rgba(220, 38, 38, 0.2)';
                        borderColor = '#DC2626';
                        textColor = '#DC2626';
                      }
                    } else if (showResult && isCorrect) {
                      backgroundColor = 'rgba(34, 197, 94, 0.2)';
                      borderColor = '#22C55E';
                      textColor = '#22C55E';
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={combatResult !== null}
                        whileHover={combatResult === null ? { scale: 1.02, x: 5 } : {}}
                        whileTap={combatResult === null ? { scale: 0.98 } : {}}
                        style={{
                          padding: '16px 20px',
                          backgroundColor,
                          border: `2px solid ${borderColor}`,
                          borderRadius: '8px',
                          color: textColor,
                          fontSize: '16px',
                          textAlign: 'left',
                          cursor: combatResult === null ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s',
                          fontWeight: isSelected ? 'bold' : 'normal'
                        }}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}

          {gameState === 'victory' && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                textAlign: 'center'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <DoorOpen size={120} color="#22C55E" />
              </motion.div>

              <motion.h1
                style={{
                  fontSize: '64px',
                  fontFamily: 'Creepster, cursive',
                  color: '#22C55E',
                  margin: '30px 0',
                  textShadow: '0 0 40px rgba(34, 197, 94, 0.8)'
                }}
                animate={{
                  textShadow: [
                    '0 0 40px rgba(34, 197, 94, 0.8)',
                    '0 0 60px rgba(34, 197, 94, 1)',
                    '0 0 40px rgba(34, 197, 94, 0.8)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                VICTORY!
              </motion.h1>

              <p style={{
                fontSize: '20px',
                color: '#9CA3AF',
                marginBottom: '40px',
                maxWidth: '600px'
              }}>
                You have conquered the quest and gained knowledge!
                <br />
                The door to <span style={{ color: '#22C55E', fontWeight: 'bold' }}>{siteName}</span> is now open.
              </p>

              <motion.button
                onClick={onComplete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(34, 197, 94, 0.5)',
                    '0 0 50px rgba(34, 197, 94, 0.8)',
                    '0 0 30px rgba(34, 197, 94, 0.5)'
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  padding: '24px 60px',
                  fontSize: '32px',
                  fontFamily: 'Creepster, cursive',
                  backgroundColor: '#22C55E',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                ENTER SITE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
