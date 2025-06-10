import { useState, useEffect, useRef } from "react";
import styles from "../Chatbot/DoctorChatbot.module.css";
import ChatbotMainContent from "../../../components/chatbot/ChatbotScreen/ChatbotScreen";
import { useAuthContext } from "../../../Context/AuthContext";
import { privateInstance } from "../../../services/api";
import { CHAT_BOT } from "../../../services/api";
import { LuSendHorizontal } from 'react-icons/lu';
import { IoImageOutline } from 'react-icons/io5';
import { IoCloseCircleOutline } from 'react-icons/io5';

const DoctorChatbot = () => {
  const { userId, authLoading } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log('Initial userId:', userId);
    const savedMessages = localStorage.getItem(`chatbotMessages_${userId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Add initial welcome message only if no saved messages
      setMessages([
        {
          type: 'bot',
          content: 'Hello! I am your medical assistant. How can I help you today?'
        }
      ]);
    }
  }, [userId]);

  useEffect(() => {
    // Save messages to localStorage whenever messages state changes
    if (userId && messages.length > 0) {
      localStorage.setItem(`chatbotMessages_${userId}`, JSON.stringify(messages));
    }
  }, [messages, userId]);

  const handleSend = async () => {
    console.log('handleSend called with message:', message, 'and file:', selectedFile);
    console.log('Current userId:', userId);
    console.log('Auth loading status:', authLoading);

    if (authLoading) {
      console.log('Auth context is still loading, not sending message.');
      return;
    }

    if (!message.trim() && !selectedFile) {
      console.log('Message and file are empty');
      return;
    }

    if (!userId) {
      console.log('No userId available after auth loading. Displaying error.');
      const errorMessage = {
        type: 'error',
        content: 'Please log in to use the chatbot.'
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const currentMessage = message.trim();

    // Add user message (text and/or image) to chat
    const userMessageContent = {
      type: 'user',
      content: currentMessage,
      ...(selectedFile && { imageUrl: URL.createObjectURL(selectedFile) })
    };
    console.log('Adding user message:', userMessageContent);
    setMessages(prev => [...prev, userMessageContent]);

    // Clear inputs immediately for better UX, but use current values for API call
    setMessage('');
    setSelectedFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setLoading(true);

    try {
      const apiUrl = CHAT_BOT.Chat_With_ChatBot(userId);
      console.log('Sending message to API:', {
        url: apiUrl,
        message: currentMessage,
        userId,
        file: selectedFile ? selectedFile.name : 'None'
      });

      const formData = new FormData();
      if (currentMessage) {
        formData.append('message', currentMessage);
      }
      if (selectedFile) {
        formData.append('scan', selectedFile);
      }
      formData.append('userId', userId);

      const response = await privateInstance.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API Response:', response.data);

      const botContent = response.data.message || response.data.reply || 'Sorry, I could not process your request.';
      const uploadedScanUrl = response.data.scan_uploaded;

      const botMessage = {
        type: 'bot',
        content: botContent,
        ...(uploadedScanUrl && { imageUrl: uploadedScanUrl })
      };
      console.log('Adding bot message:', botMessage);
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      const errorMessage = {
        type: 'error',
        content: error.response?.data?.message || 'Sorry, there was an error processing your message.'
      };
      console.log('Adding error message:', errorMessage);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setImagePreviewUrl(fileUrl);
      // Do NOT clear text message if image is selected, allow both
    }
  };

  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearSelectedImage = () => {
    setSelectedFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  console.log('Current messages:', messages);

  return (
    <div className={styles.container}>
      <div className={styles.chatArea}>
        <ChatbotMainContent messages={messages} loading={loading} />
        <footer className={styles.footer}>
          <div className={styles.inputContainer}>
            <IoImageOutline
              className={styles.leftIcon}
              onClick={handleImageUploadClick}
              style={{ cursor: loading || authLoading ? 'not-allowed' : 'pointer' }}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*"
            />

            {selectedFile && imagePreviewUrl && ( // Render image preview above the input
              <div className={styles.imagePreviewWrapper}>
                <img src={imagePreviewUrl} alt="Selected" className={styles.imagePreview} />
                <IoCloseCircleOutline
                  className={styles.clearImageButton}
                  onClick={clearSelectedImage}
                  disabled={loading || authLoading}
                />
              </div>
            )}

            <input
              className={styles.input}
              type="text"
              placeholder={selectedFile ? "Add a message with your image..." : "Type your message here..."} // Dynamic placeholder
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || authLoading}
            />

            <div className={styles.rightIcons}>
              <button
                className={`${styles.sendButton} ${loading || authLoading || (!message.trim() && !selectedFile) ? styles.disabled : ''}`}
                onClick={handleSend}
                disabled={loading || authLoading || (!message.trim() && !selectedFile)}
              >
                <LuSendHorizontal className={styles.icon} />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DoctorChatbot; 