'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './ask.module.css';

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

  // Load conversation from localStorage on component mount
  useEffect(() => {
    const savedConversation = localStorage.getItem('agents-of-faith-conversation');
    if (savedConversation) {
      try {
        const parsed = JSON.parse(savedConversation);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error loading conversation:', error);
        localStorage.removeItem('agents-of-faith-conversation');
      }
    }
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('agents-of-faith-conversation', JSON.stringify(messages));
      // Update last saved timestamp
      localStorage.setItem('agents-of-faith-last-saved', new Date().toISOString());
    }
  }, [messages]);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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



  const getConversationDuration = () => {
    if (messages.length < 2) return null;
    const start = messages[0]?.timestamp;
    const end = messages[messages.length - 1]?.timestamp;
    if (!start || !end) return null;
    const duration = end.getTime() - start.getTime();
    const minutes = Math.floor(duration / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getLastActivity = () => {
    if (messages.length === 0) return null;
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return null;
    const now = new Date();
    const diff = now.getTime() - lastMessage.timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getConversationStats = () => {
    const userMessages = messages.filter(m => m.role === 'user').length;
    const assistantMessages = messages.filter(m => m.role === 'assistant').length;
    const totalWords = messages.reduce((sum, m) => sum + m.content.split(' ').length, 0);
    
    return {
      userMessages,
      assistantMessages,
      totalWords,
      averageWordsPerMessage: totalWords / messages.length || 0
    };
  };

  const getStorageSize = () => {
    try {
      const conversation = localStorage.getItem('agents-of-faith-conversation');
      if (conversation) {
        const sizeInBytes = new Blob([conversation]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(1);
        return `${sizeInKB} KB`;
      }
      return '0 KB';
    } catch {
      return 'Unknown';
    }
  };

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
    
    // Create a better filename with conversation title
    const title = getConversationTitle().replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 30);
    const date = new Date().toISOString().split('T')[0];
    const filename = title ? `${title}-${date}.txt` : `theological-conversation-${date}.txt`;
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  }, [messages, getConversationTitle]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux) to clear chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        clearChat();
      }
      // Cmd+E (Mac) or Ctrl+E (Windows/Linux) to export
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        exportConversation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearChat, exportConversation]);

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('### ')) {
          return <h3 key={index} className={styles.sectionHeader}>{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className={styles.sectionHeader}>{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className={styles.sectionHeader}>{line.substring(2)}</h1>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className={styles.messageParagraph}>{line}</p>;
      });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Ask a Theological Question</h1>
            <p className={styles.subtitle}>
              Get comprehensive answers grounded in Scripture and theological tradition
            </p>
            {messages.length > 0 && (
              <div className={styles.conversationTitle}>
                <span className={styles.titleLabel}>Conversation:</span>
                <span className={styles.titleText}>{getConversationTitle()}</span>
              </div>
            )}
          </div>
          {messages.length > 0 && (
            <div className={styles.headerActions}>
              <div className={styles.conversationInfo}>
                <span className={styles.messageCount}>
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </span>
                <span className={styles.conversationDate}>
                  Started {messages[0]?.timestamp.toLocaleDateString()} at {messages[0]?.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {getConversationDuration() && (
                  <span className={styles.conversationDuration}>
                    Duration: {getConversationDuration()}
                  </span>
                )}
                <span className={styles.lastActivity}>
                  Last: {getLastActivity()}
                </span>
                <div className={styles.conversationStats}>
                  <span className={styles.statItem}>
                    You: {getConversationStats().userMessages}
                  </span>
                  <span className={styles.statItem}>
                    AI: {getConversationStats().assistantMessages}
                  </span>
                  <span className={styles.statItem}>
                    Words: {getConversationStats().totalWords.toLocaleString()}
                  </span>
                  <span className={styles.saveIndicator}>
                    💾 Auto-saved
                  </span>
                  <span className={styles.storageSize}>
                    Size: {getStorageSize()}
                  </span>
                </div>
              </div>
              <button
                onClick={exportConversation}
                className={styles.exportButton}
                title="Export conversation as text file"
              >
                📥 Export
              </button>
              <button
                onClick={clearChat}
                className={styles.clearButton}
                title="Clear conversation history"
              >
                🗑️ Clear Chat
              </button>
            </div>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.chatContainer}>
          <div className={styles.messagesContainer}>
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <h3>Welcome to Agents of Faith</h3>
                <p>
                  Ask me any question about Scripture, theology, or Christian doctrine. 
                  I&apos;ll provide a comprehensive answer with biblical citations, historical context, 
                  and practical application.
                </p>
                <div className={styles.exampleQuestions}>
                  <h4>Example Questions:</h4>
                  <ul>
                    <li>&ldquo;What does it mean to be created in God&apos;s image?&rdquo;</li>
                    <li>&ldquo;How should Christians understand the Trinity?&rdquo;</li>
                    <li>&ldquo;What is the biblical view of salvation by grace?&rdquo;</li>
                    <li>&ldquo;How do we interpret difficult passages in the Old Testament?&rdquo;</li>
                  </ul>
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage
                }`}
              >
                <div className={styles.messageContent}>
                  {message.role === 'user' ? (
                    <p>{message.content}</p>
                  ) : (
                    <div className={styles.assistantContent}>
                      {formatMessage(message.content)}
                    </div>
                  )}
                </div>
                <div className={styles.messageTimestamp}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <div className={styles.inputContainer}>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your theological question here..."
                className={styles.textInput}
                rows={3}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={styles.sendButton}
              >
                {isLoading ? 'Thinking...' : 'Ask Question'}
              </button>
            </div>
            <div className={styles.inputHints}>
              <p className={styles.inputHint}>
                Press Enter to send, Shift+Enter for new line
              </p>
              <p className={styles.keyboardShortcuts}>
                <span className={styles.shortcut}>⌘+K</span> Clear chat • 
                <span className={styles.shortcut}>⌘+E</span> Export
              </p>
            </div>
            
            {showExportSuccess && (
              <div className={styles.exportSuccess}>
                ✅ Conversation exported successfully!
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
