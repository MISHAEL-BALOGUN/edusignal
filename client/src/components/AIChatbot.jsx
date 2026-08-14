import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const generateAIResponse = (message, context = {}) => {
  const lowerMessage = message.toLowerCase();
  
  const responses = {
    greeting: [
      "Hello! I'm eduAI, your student success assistant. How can I help you today?",
      "Hi there! I can help with intervention recommendations, student analysis, or academic strategies. What would you like to know?"
    ],
    intervention: [
      "Based on the student's profile, I recommend: 1) One-on-one tutoring sessions, 2) Regular progress monitoring, 3) Parent communication plan. Would you like more details on any of these?",
      "For effective intervention, consider: a structured support plan, peer mentoring, and consistent check-ins. The key is early and frequent engagement.",
      "I suggest a multi-tiered approach: academic support, behavioral monitoring, and social-emotional learning activities."
    ],
    tutoring: [
      "Tutoring recommendations: Schedule 2-3 sessions per week focusing on core subjects. Pair with a peer tutor for collaborative learning. Track progress weekly.",
      "Consider both peer tutoring and professional tutoring services. Students benefit most from consistent, structured support with clear learning objectives.",
      "Online tutoring platforms can supplement in-person sessions. I recommend 30-45 minute focused sessions for optimal engagement."
    ],
    parent: [
      "Parent-teacher conferences should be scheduled within the next 2 weeks. Prepare specific examples of both strengths and areas for improvement. Include the student in the conversation when appropriate.",
      "Regular parent communication is crucial. Send weekly progress updates and celebrate small wins. Address concerns promptly and collaboratively.",
      "Consider a family engagement plan that includes at-home learning activities and clear communication channels."
    ],
    attendance: [
      "For attendance issues: 1) Identify root causes, 2) Create an attendance contract, 3) Implement a check-in system, 4) Celebrate improvements. Early intervention is key.",
      "Chronic absenteeism often signals deeper issues. Consider social-emotional assessments and connecting families with support resources.",
      "Implement an attendance incentive program and maintain daily communication with families of at-risk students."
    ],
    behavior: [
      "Behavioral support strategies: Positive reinforcement, clear expectations, restorative practices, and consistent consequences. Focus on building relationships.",
      "Consider a Functional Behavior Assessment (FBA) for persistent issues. Develop a Behavior Intervention Plan (BIP) with specific, measurable goals.",
      "Social-emotional learning programs can prevent behavioral issues. Teach self-regulation skills and provide safe spaces for emotional expression."
    ],
    grades: [
      "To improve grades: Implement study skills workshops, provide differentiated instruction, offer extra credit opportunities, and use formative assessments to guide instruction.",
      "Grade improvement strategies: Goal-setting conferences, progress monitoring, targeted interventions, and student-led conferences to build ownership.",
      "Consider grade recovery options and alternative assessments. Focus on mastery learning rather than just grades."
    ],
    risk: [
      "Risk factors are identified through multiple data points: academic performance, attendance, behavior, and social-emotional indicators. Regular monitoring helps catch issues early.",
      "High-risk students need immediate, intensive intervention. Consider a multi-disciplinary team approach with counselor, teachers, and administrators.",
      "Risk assessment should be reviewed monthly. Adjust interventions based on student response and progress toward goals."
    ],
    counseling: [
      "Counseling referrals should be made when students show signs of: persistent sadness, social withdrawal, academic decline, or behavioral changes. Early intervention improves outcomes.",
      "School counselors can provide individual and group counseling, crisis intervention, and connections to community resources. Don't hesitate to refer.",
      "Social-emotional learning programs and counseling services work together to support the whole student."
    ],
    mentor: [
      "Peer mentoring programs: Match older students with younger ones, provide training for mentors, and create structured meeting times. Benefits both mentor and mentee.",
      "Adult mentoring: Connect at-risk students with trusted adults in the school. Regular check-ins build relationships and provide consistent support.",
      "Mentoring programs should include clear goals, regular progress monitoring, and recognition for participation."
    ]
  };

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  if (lowerMessage.includes('intervention') || lowerMessage.includes('help')) {
    return responses.intervention[Math.floor(Math.random() * responses.intervention.length)];
  }
  if (lowerMessage.includes('tutor') || lowerMessage.includes('tutoring')) {
    return responses.tutoring[Math.floor(Math.random() * responses.tutoring.length)];
  }
  if (lowerMessage.includes('parent') || lowerMessage.includes('conference') || lowerMessage.includes('family')) {
    return responses.parent[Math.floor(Math.random() * responses.parent.length)];
  }
  if (lowerMessage.includes('attendance') || lowerMessage.includes('absent') || lowerMessage.includes('absence')) {
    return responses.attendance[Math.floor(Math.random() * responses.attendance.length)];
  }
  if (lowerMessage.includes('behavior') || lowerMessage.includes('behavioral') || lowerMessage.includes('discipline')) {
    return responses.behavior[Math.floor(Math.random() * responses.behavior.length)];
  }
  if (lowerMessage.includes('grade') || lowerMessage.includes('score') || lowerMessage.includes('academic')) {
    return responses.grades[Math.floor(Math.random() * responses.grades.length)];
  }
  if (lowerMessage.includes('risk') || lowerMessage.includes('at-risk') || lowerMessage.includes('flag')) {
    return responses.risk[Math.floor(Math.random() * responses.risk.length)];
  }
  if (lowerMessage.includes('counsel') || lowerMessage.includes('therapy') || lowerMessage.includes('mental health')) {
    return responses.counseling[Math.floor(Math.random() * responses.counseling.length)];
  }
  if (lowerMessage.includes('mentor') || lowerMessage.includes('peer') || lowerMessage.includes('buddy')) {
    return responses.mentor[Math.floor(Math.random() * responses.mentor.length)];
  }

  if (context.studentName) {
    return `Based on ${context.studentName}'s profile, I recommend monitoring their progress closely. ${
      context.riskScore > 60 
        ? 'Given their high risk score, immediate intervention is needed. Consider a comprehensive support plan including academic tutoring, counseling, and regular parent communication.'
        : context.riskScore > 30
        ? 'With a moderate risk score, focus on preventive measures like study skills development and regular check-ins.'
        : 'They are currently low risk. Continue monitoring and provide enrichment opportunities to maintain their progress.'
    } Would you like specific intervention recommendations?`;
  }

  return "I can help with intervention strategies, student analysis, attendance solutions, behavioral support, and academic improvement plans. What specific area would you like to discuss?";
};

const AIChatbot = ({ context = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I\'m eduAI, your student success assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: generateAIResponse(inputValue, context)
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "Recommend interventions",
    "How to improve attendance?",
    "Behavior support strategies",
    "Schedule parent conference"
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg transition-all hover:scale-105 z-50"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[calc(100vw-2rem)] max-w-96 h-[500px] max-h-[calc(100vh-5rem)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="bg-primary text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold">eduAI Assistant</h3>
                <p className="text-xs text-white/80">Student Success Helper</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-100">
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(action);
                  }}
                  className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-primary/20 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-primary text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-primary hover:bg-primary-dark text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
