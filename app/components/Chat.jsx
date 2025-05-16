import { assets } from '@/assets/assets'
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion } from "motion/react"
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const Chat = ({ isDarkMode }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "안녕하세요! 저에 대해 궁금한 점이 있으시면 무엇이든 물어보세요 🙂 ", 
      isUser: false,
      isTyping: false,
      displayText: "안녕하세요! 저에 대해 궁금한 점이 있으시면 무엇이든 물어보세요 🙂 " 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [threadId, setThreadId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const typingSpeed = 10; // 타이핑 속도 (ms)를 10ms로 변경하여 더 빠르게 설정

  // 새 메시지가 추가될 때 채팅창 내부만 스크롤
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      // 채팅 컨테이너 내부에서만 스크롤 수행
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 타이핑 효과 구현
  useEffect(() => {
    const typingMessage = messages.find(msg => msg.isTyping);
    
    if (typingMessage) {
      if (typingMessage.displayText.length < typingMessage.text.length) {
        const timer = setTimeout(() => {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === typingMessage.id 
                ? { 
                    ...msg, 
                    displayText: msg.text.substring(0, msg.displayText.length + 1) 
                  } 
                : msg
            )
          );
        }, typingSpeed);
        
        return () => clearTimeout(timer);
      } else {
        // 타이핑 완료
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === typingMessage.id 
              ? { ...msg, isTyping: false } 
              : msg
          )
        );
        setIsTyping(false);
      }
    }
  }, [messages]);

  // 채팅 메시지 전송 함수
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || isTyping) return;

    // 사용자 메시지 추가
    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      displayText: inputMessage,
      isUser: true
    };
    setMessages([...messages, newUserMessage]);
    setInputMessage('');

    try {
      // 로딩 메시지 추가
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: '',
          displayText: '',
          isUser: false,
          isLoading: true
        }
      ]);

      // Flask 서버로 POST 요청 (JSON 방식)
      const response = await axios.post(`${API_URL}/sendMessage`, {
        message: inputMessage,
        thread_id: threadId
      });

      // 로딩 메시지 제거
      setMessages(prev => prev.filter(msg => !msg.isLoading));

      // 응답에서 스레드 ID 업데이트
      if (response.data.thread_id) {
        setThreadId(response.data.thread_id);
      }

      // AI 응답 추출 및 추가
      if (response.data.response) {
        setIsTyping(true);
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            text: response.data.response,
            displayText: '', // 처음에는 빈 문자열로 시작
            isUser: false,
            isTyping: true
          }
        ]);
      } else if (response.data.error) {
        // 오류 메시지 처리
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            text: `오류: ${response.data.error}`,
            displayText: `오류: ${response.data.error}`,
            isUser: false
          }
        ]);
      }
    } catch (error) {
      // 로딩 메시지 제거
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      // 오류 메시지 추가
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: 'AI 서버와 통신 중 오류가 발생했습니다.',
          displayText: 'AI 서버와 통신 중 오류가 발생했습니다.',
          isUser: false
        }
      ]);
      console.error('에러 상세 내용:', error);
    }
  };

  function renderMessageText(message) {
    const { text, displayText, isLoading } = message;
    
    // 로딩 메시지인 경우
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <div className="dots-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      );
    }
    
    // 코드 블록 감지
    const codeBlockMatch = displayText.match(/```(.*?)\\n([\\s\\S]*?)```/);
    if (codeBlockMatch) {
      const language = codeBlockMatch[1];
      const code = codeBlockMatch[2].replace(/\\n/g, '\n'); // 줄바꿈 처리
      return (
        <pre style={{background: '#222', color: '#fff', padding: 10, borderRadius: 8, overflowX: 'auto'}}>
          <code>
            {code}
          </code>
        </pre>
      );
    }
    // 일반 텍스트
    return <span>{displayText}</span>;
  }

  return (
    <motion.div 
      initial={{opacity: 0}}
      whileInView={{opacity: 1}}
      transition={{duration: 1}}
      id='chat' 
      className='w-full max-w-[100vw] px-4 sm:px-8 md:px-[12%] mt-20 py-16 scroll-mt-20 relative'
    >
      <div className='absolute left-1/2 transform -translate-x-1/2 -top-[5%] w-[120%] h-[110%] bg-[url("/footer-bg-color.png")] bg-no-repeat bg-center bg-[length:120%_100%] dark:bg-none z-[-1]'></div>
      
      <div className='mx-auto max-w-full md:max-w-[85%] border-[0.5px] border-gray-400 dark:border-white/70 rounded-2xl py-12 px-4 sm:px-8 bg-white/30 dark:bg-darkHover/10 backdrop-blur-sm shadow-lg'>
        <motion.h4 
          initial={{y: -20, opacity: 0}}
          whileInView={{y:0, opacity: 1}}
          transition={{delay: 0.3, duration: 0.5}}
          className='text-center mb-2 text-lg font-Ovo'
        >
          Ask me anything
        </motion.h4>
        
        <motion.h2 
          initial={{y: -20, opacity: 0}}
          whileInView={{y:0, opacity: 1}}
          transition={{delay: 0.5, duration: 0.5}}
          className='text-center text-5xl font-Ovo px-2 break-words mx-auto max-w-[90%]'
        >
          Conversational Chatbot
        </motion.h2>

        <motion.p 
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{delay: 0.7, duration: 0.5}}
          className='text-center max-w-2xl mx-auto mt-5 mb-16 font-Ovo px-2'
        >
          Do you have any questions? Ask the chatbot. We will answer information about the portfolio owner.
        </motion.p>

        <motion.div 
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{delay: 0.9, duration: 0.5}}
          className='max-w-2xl mx-auto px-1'
        >
          <div className='rounded-xl overflow-hidden mb-4 border-[0.5px] border-gray-400 dark:border-white/90 p-[1px]'>
            <div 
              ref={chatContainerRef}
              className='bg-white dark:bg-darkHover/30 p-4 h-96 overflow-y-auto custom-scrollbar rounded-lg'
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: isDarkMode ? '#3a3a3a #2a004a' : '#c0c0c0 #ffffff'
              }}
            >
              <div className='pr-2'>
                {messages.map((message) => (
                  <motion.div 
                    key={message.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex mb-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        message.isUser 
                          ? 'bg-black/80 text-white dark:bg-darkTheme dark:border-[0.5px] dark:border-white/90' 
                          : 'bg-lightHover text-black dark:bg-darkHover/70 dark:text-white/90 dark:border-[0.5px] dark:border-white/90'
                      }`}
                    >
                      {renderMessageText(message)}
                      {message.isTyping && (
                        <span className="inline-block w-1 h-4 ml-1 bg-black dark:bg-white animate-cursor"></span>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          <motion.div 
            initial={{y: 50, opacity: 0}}
            whileInView={{y:0, opacity: 1}}
            transition={{delay: 1.1, duration: 0.5}}
            className='relative max-w-2xl mx-auto'
          >
            <form 
              onSubmit={handleSendMessage} 
              className='flex items-center rounded-full border-[0.5px] border-gray-400 dark:border-white/50 bg-white dark:bg-darkHover/30 shadow-md'
            >
              <div className='flex-grow'>
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder='무엇이든 물어보세요' 
                  className='w-full py-3 px-5 bg-transparent outline-none text-black dark:text-white/90 placeholder-gray-500 dark:placeholder-gray-400 placeholder:text-sm'
                  disabled={isTyping}
                />
              </div>
              <div className='flex items-center px-3'>
                <button
                  type='submit'
                  className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-darkHover transition-colors'
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Image 
                    src={assets.send_icon} 
                    alt='Send' 
                    className={`w-5 h-5 ${isDarkMode ? 'brightness-[2.5] contrast-[1.2] opacity-90' : ''} ${isTyping ? 'opacity-50' : ''}`} 
                  />
                </button>
              </div>
            </form>
          </motion.div>

          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 7px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
              margin: 4px 0;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: ${isDarkMode ? '#3a3a3a' : '#c0c0c0'};
              border-radius: 10px;
              border: ${isDarkMode ? '1px solid #2a004a' : '1px solid #f8f8f8'};
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: ${isDarkMode ? '#4d4d4d' : '#a9a9a9'};
            }
            
            .dots-container {
              display: flex;
              align-items: center;
              height: 20px;
            }
            
            .dot {
              width: 6px;
              height: 6px;
              margin: 0 2px;
              border-radius: 50%;
              background-color: ${isDarkMode ? '#fff' : '#000'};
              opacity: 0.7;
              display: inline-block;
              animation-name: bounce;
              animation-duration: 1.2s;
              animation-iteration-count: infinite;
            }
            
            .dot:nth-child(1) {
              animation-delay: 0s;
            }
            
            .dot:nth-child(2) {
              animation-delay: 0.2s;
            }
            
            .dot:nth-child(3) {
              animation-delay: 0.4s;
            }
            
            @keyframes bounce {
              0%, 80%, 100% {
                transform: translateY(0);
              }
              40% {
                transform: translateY(-8px);
              }
            }
            
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
            
            .animate-cursor {
              animation: blink 1s step-end infinite;
            }
          `}</style>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Chat