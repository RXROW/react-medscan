import React from 'react';
import styles from '../../ChatbotCss/Chatbot.module.css';
import { FaArrowLeft, FaBell } from 'react-icons/fa';

const ChatbotHeader = ({ user }) => {
  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
  <FaArrowLeft className={styles.backIcon} />
  <span className={styles.title}>Chatbot</span>
</div>

      <div className={styles.userSection}>
        <FaBell className={styles.icon} />
        <img
          src={user?.avatar || "https://i.pravatar.cc/40"}
          alt="User"
          className={styles.avatar}
        />
      </div>
    </header>
  );
};

export default ChatbotHeader;
