'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Load conversation from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('agents-of-faith-conversation');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Failed to parse saved conversation:', error);
      }
    }
  }, []);

  // Save conversation to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('agents-of-faith-conversation', JSON.stringify(messages));
      localStorage.setItem('agents-of-faith-last-saved', new Date().toISOString());
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // iOS Safari: ensure input remains visible above keyboard
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const handleFocus = () => {
      // Scroll the input into view on focus
      setTimeout(() => {
        el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }, 50);
    };
    el.addEventListener('focus', handleFocus);
    return () => el.removeEventListener('focus', handleFocus);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = useCallback(() => {
    if (messages.length > 0 && window.confirm('Are you sure you want to clear the entire conversation? This action cannot be undone.')) {
      setMessages([]);
      localStorage.removeItem('agents-of-faith-conversation');
    }
  }, [messages]);

  const getConversationTitle = useCallback(() => {
    if (messages.length === 0) return '';
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (!firstUserMessage) return '';
    
    const content = firstUserMessage.content;
    if (content.length <= 50) return content;
    return content.substring(0, 50) + '...';
  }, [messages]);

  const exportConversation = useCallback(() => {
    const conversationText = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const title = getConversationTitle().replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 30);
    const date = new Date().toISOString().split('T')[0];
    const filename = title ? `${title}-${date}.txt` : `theological-conversation-${date}.txt`;
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  }, [messages, getConversationTitle]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        clearChat();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        exportConversation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearChat, exportConversation]);

  const formatMessage = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{line.substring(2)}</h1>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-gray-700 leading-relaxed mb-3">{line}</p>;
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline font-medium">Back</span>
              </Link>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Ask a Question</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Theological AI Assistant</p>
              </div>
            </div>
            
            {messages.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportConversation}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Export conversation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <button
                  onClick={clearChat}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-[calc(100dvh-4rem)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-[calc(7rem+env(safe-area-inset-bottom))]">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Agents of Faith</h2>
                                 <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                   Ask me any question about Scripture, theology, or Christian doctrine. 
                   I&apos;ll provide a comprehensive answer with biblical citations, historical context, 
                   and practical application.
                 </p>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 max-w-2xl mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-4">Example Questions:</h3>
                  <div className="space-y-3 text-left">
                                         <div className="flex items-start space-x-3">
                       <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                       <p className="text-gray-700">&ldquo;What does it mean to be created in God&apos;s image?&rdquo;</p>
                     </div>
                     <div className="flex items-start space-x-3">
                       <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                       <p className="text-gray-700">&ldquo;How should Christians understand the Trinity?&rdquo;</p>
                     </div>
                     <div className="flex items-start space-x-3">
                       <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                       <p className="text-gray-700">&ldquo;What is the biblical view of salvation by grace?&rdquo;</p>
                     </div>
                     <div className="flex items-start space-x-3">
                       <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                       <p className="text-gray-700">&ldquo;How do we interpret difficult passages in the Old Testament?&rdquo;</p>
                     </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Messages */}
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] lg:max-w-[70%] ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' 
                      : 'bg-white text-gray-900 rounded-2xl rounded-bl-md shadow-sm border border-gray-200'
                  } p-4`}>
                    <div className="prose prose-sm max-w-none">
                      {message.role === 'user' ? (
                        <p className="text-white">{message.content}</p>
                      ) : (
                        <div className="text-gray-900">
                          {formatMessage(message.content)}
                        </div>
                      )}
                    </div>
                    <div className={`text-xs mt-3 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="max-w-4xl mx-auto">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask your theological question here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors will-change-[height]"
                    rows={2}
                    disabled={isLoading}
                    style={{ minHeight: '48px', maxHeight: '160px' }}
                    onInput={(e) => {
                      const t = e.currentTarget;
                      t.style.height = 'auto';
                      const next = Math.min(t.scrollHeight, 160);
                      t.style.height = next + 'px';
                    }}
                    enterKeyHint="send"
                    autoCapitalize="sentences"
                    autoCorrect="on"
                    inputMode="text"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="hidden sm:inline">⌘+K Clear • ⌘+E Export</span>
                </div>
              </div>
            </form>
            
            {showExportSuccess && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm text-center">
                ✅ Conversation exported successfully!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
