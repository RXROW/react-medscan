import React, { useRef, useEffect } from 'react';
import styles from '../../ChatbotCss/Chatbot.module.css';
import { LiaCommentsSolid } from 'react-icons/lia';
import { VscSparkle } from 'react-icons/vsc';
import { PiShieldWarningLight } from 'react-icons/pi';
import only from "../../../assets/images/chatbot/only1.PNG";

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

  if (messages.length === 0) {
    return (
      <div className={styles.main}>
        <div className={styles.brandContainer}>
          <img src={only} alt="MedScan Logo" className={styles.logo} />
          <h1 className={styles.brand}>MEDSCAN</h1>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoBox}>
            <LiaCommentsSolid className={styles.infoIcon} />
            <h3>Examples</h3>
            <p>"Analyze this chest X-ray for potential issues"</p>
            <p>"What does a mild disc bulge mean?"</p>
            <p>"Suggest a specialist for my scan results"</p>
          </div>

          <div className={styles.infoBox}>
            <VscSparkle className={styles.infoIcon} />
            <h3>Capabilities</h3>
            <p>Processes medical scans and provides an initial diagnosis</p>
            <p>Suggests precautions before consulting a doctor</p>
            <p>Recommends top-rated doctors based on your location</p>
          </div>

          <div className={styles.infoBox}>
            <PiShieldWarningLight className={styles.infoIcon} />
            <h3>Limitations</h3>
            <p>Cannot replace professional medical advice</p>
            <p>Accuracy depends on scan quality and AI model training</p>
            <p>Does not support real-time emergency diagnosis</p>
          </div>
        </div>
      </div>
    );
  }

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
