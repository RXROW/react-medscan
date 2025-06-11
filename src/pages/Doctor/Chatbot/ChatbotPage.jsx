import { useState, useEffect, useRef } from "react";
import styles from "../Chatbot/DoctorChatbot.module.css";
import ChatbotMainContent from "../../../components/chatbot/ChatbotScreen/ChatbotScreen";
import { useAuthContext } from "../../../Context/AuthContext";
import { privateInstance } from "../../../services/api";
import { CHAT_BOT } from "../../../services/api";
import { LuSendHorizontal } from 'react-icons/lu';
import { IoImageOutline } from 'react-icons/io5';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { LiaCommentsSolid } from 'react-icons/lia';
import { VscSparkle } from 'react-icons/vsc';
import { PiShieldWarningLight } from 'react-icons/pi';
import { MdDelete } from 'react-icons/md';
import only from "../../../assets/images/chatbot/only1.PNG";
import styles1 from '../../../components/ChatbotCss/Chatbot.module.css';

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
      // Removed the initial welcome message
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

  const handleClearChat = () => {
    localStorage.removeItem(`chatbotMessages_${userId}`);
    setMessages([]);
  };

  console.log('Current messages:', messages);

  return (
    <div className={styles.container}>
      <div className={styles.chatArea}>
        {messages.length === 0 ? (
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
        ) : (
          <ChatbotMainContent messages={messages} loading={loading} />
        )}
        <footer className={styles.footer}>
          <div className={styles.inputContainer}>
            <IoImageOutline
              className={styles.leftIcon}
              onClick={handleImageUploadClick}
              style={{ cursor: loading || authLoading ? 'not-allowed' : 'pointer' }}
            />

            {selectedFile && imagePreviewUrl && (
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
              placeholder={selectedFile ? "Add a message with your image..." : "Type your message here..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || authLoading}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*"
            />

            <div className={styles.rightIcons}>
              <MdDelete
                className={styles.clearChatButton}
                onClick={handleClearChat}
                style={{ cursor: loading || authLoading ? 'not-allowed' : 'pointer' }}
                title="Clear Chat"
              />
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