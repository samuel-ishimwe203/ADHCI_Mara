import Sentiment from 'sentiment';
const sentiment = new Sentiment();

const BIBLE_VERSES = [
  "Philippians 4:13 – I can do all things through Christ who strengthens me.",
  "Psalm 34:18 – The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
  "Isaiah 41:10 – So do not fear, for I am with you; do not be dismayed, for I am your God.",
  "John 14:27 – Peace I leave with you; my peace I give you.",
  "Jeremiah 29:11 – For I know the plans I have for you, declares the Lord."
];

const COPING_ACTIVITIES = [
  "Take 10 deep breaths and focus on the present moment.",
  "Write down three things you are grateful for today.",
  "Listen to calming music for 5 minutes.",
  "Go for a short walk and observe your surroundings.",
  "Talk to a friend or family member about your feelings."
];

export class Mara {
  greet() {
    const greetings = [
      "Hello! I'm Mara 🌸, your AI friend. How are you feeling today?",
      "Hi! Mara here. I'm ready to listen and guide you. How are you?",
      "Hey! Let's talk. How's your day going?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  detectMood(message) {
    const analysis = sentiment.analyze(message);
    const polarity = analysis.score / 10; // Normalize to ~ -1 to 1
    if (polarity > 0.2) return 'happy';
    if (polarity < -0.2) return 'sad';
    return 'neutral';
  }

  isQuestion(message) {
    const questionKeywords = ['do you', 'what is', 'who is', 'where is', 'how is', 'tell me about', 'know about'];
    return questionKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }

  reflectiveConversation(userId, message, mood) {
    const lowerMsg = message.toLowerCase();
    if (this.isQuestion(message)) {
      // Basic question handling (expand as needed)
      if (lowerMsg.includes('rwanda')) {
        return "Rwanda is a beautiful country in East Africa, known as the Land of a Thousand Hills. It's home to gorillas, vibrant culture, and resilient people. What's your connection to it? 🌍";
      }
      if (lowerMsg.includes('country') || lowerMsg.includes('place')) {
        return "I'd love to hear about the place or country on your mind! Tell me more—what draws you to it?";
      }
      return "That's a great question! I'm here to explore it with you. Can you tell me more?";
    }
    let response;
    if (mood === 'happy') {
      response = "I'm glad to hear that! Keep smiling 🌞 What made you feel this way?";
    } else if (mood === 'sad') {
      response = `${COPING_ACTIVITIES[Math.floor(Math.random() * COPING_ACTIVITIES.length)]}\nRemember this verse: ${BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)]}`;
    } else {
      response = `I see. Let's try a positive thought: ${BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)]}`;
    }
    return response;
  }
}

export function detectCrisis(text) {
  const t = text.toLowerCase();
  const patterns = [/kill myself/, /i want to die/, /suicid/, /end my life/, /hurting myself/, /cant go on/, /no reason to live/, /die alone/, /i want to kill/, /i want to go in love/, /i hate myself/, /worthless/, /give up on life/, /i am a burden/, /nobody cares/, /i can't take this anymore/, /i feel hopeless/, /i feel trapped/, /i feel like a failure/, /i want to disappear/, /i want to end it all/, /i want to commit/];
  return patterns.some(p => p.test(t));
}