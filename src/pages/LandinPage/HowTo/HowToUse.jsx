import React from "react";
import styles from "../HowTo/HowToUse.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowUp, faCommentMedical, faNotesMedical } from '@fortawesome/free-solid-svg-icons';

function HowToUse() {
  const steps = [
    {
      icon: faFileArrowUp,
      title: "Upload Your Scans",
      desc: "Begin by uploading your medical scans and images. Our advanced AI technology supports various formats and provides instant analysis.",
      number: "01"
    },
    {
      icon: faCommentMedical,
      title: "Answer Follow-Up Questions",
      desc: "Our intelligent system will ask relevant follow-up questions to better understand your symptoms and provide more accurate results.",
      number: "02"
    },
    {
      icon: faNotesMedical,
      title: "Receive Your Results",
      desc: "Get comprehensive analysis and insights about your health condition, along with recommended next steps and professional medical advice.",
      number: "03"
    },
  ];

  return (
    <div className={styles.section} id="How-to-use">
      <h2 className={styles.title}>How It Works</h2>
      <p className={styles.subtitle}>
        Experience the future of medical analysis with our AI-powered platform.
        Get accurate results in minutes, not days.
      </p>

      <div className={styles.container}>
        {steps.map((step, index) => (
          <div className={styles.box} key={index}>
            <div className={styles.stepNumber}>{step.number}</div>
            <FontAwesomeIcon icon={step.icon} className={styles.icon} />
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.description}>{step.desc}</p>
          </div>
        ))}
      </div>

      <a href="#upload" className={styles.button}>
        Start Your Analysis
        <span className={styles.buttonArrow}>→</span>
      </a>
    </div>
  );
}

export default HowToUse;
