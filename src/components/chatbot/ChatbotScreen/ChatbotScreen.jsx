import React, { useRef, useEffect } from 'react';
import styles from '../../ChatbotCss/Chatbot.module.css'; 

const ChatbotMainContent = ({ messages = [], loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log('ChatbotMainContent received messages:', messages);
    scrollToBottom();
  }, [messages]);

  // Helper function to format message content (basic markdown support)
  const formatMessageContent = (text) => {
    if (!text) return null;

    // Split by double newline for paragraphs, then handle single newlines as <br />
    const paragraphs = text.split(/\n\n/);

    return paragraphs.map((paragraph, paraIndex) => {
      // Check for list items
      if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
        const listItems = paragraph.split('\n').map((item, itemIndex) => {
          // Handle bold text within list items
          let formattedItem = item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          formattedItem = formattedItem.replace(/^- |^\* /, ''); // Remove list markdown
          return <li key={itemIndex} dangerouslySetInnerHTML={{ __html: formattedItem.trim() }} />;
        });
        return <ul key={paraIndex}>{listItems}</ul>;
      } else {
        // Handle bold text and single newlines within regular paragraphs
        let formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedParagraph = formattedParagraph.replace(/\n/g, '<br />');
        return <p key={paraIndex} dangerouslySetInnerHTML={{ __html: formattedParagraph }} />;
      }
    });
  };

  return (
    <div className={styles.chatContainer}>
      {messages.map((message, index) => {
        console.log('Rendering message:', message);
        return (
          <div
            key={index}
            className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.botMessage
              } ${message.type === 'error' ? styles.errorMessage : ''}`}
          >
            <div className={styles.messageContent}>
              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="Uploaded Scan"
                  className={styles.chatImage}
                />
              )}
              {formatMessageContent(message.content)}
            </div>
          </div>
        );
      })}
      {loading && (
        <div className={`${styles.message} ${styles.botMessage}`}>
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
  );
};

export default ChatbotMainContent;
