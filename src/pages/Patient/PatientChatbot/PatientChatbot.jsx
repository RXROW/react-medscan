import React from "react";  
import ChatbotMainContent from "../../../components/chatbot/ChatbotScreen/ChatbotScreen";
import DoctorChatbot from "../../Doctor/Chatbot/ChatbotPage";
 
const PatientChatbot = () => {
  const user = {
    name: "Sara123",
    avatar: "https://i.pravatar.cc/40?u=patient.sara",
  };

  const handleSend = (msg) => {
    console.log("Message sent:", msg);
  };

  return (
  
     
      <div > 
    </div>
  );
};

export default PatientChatbot;
