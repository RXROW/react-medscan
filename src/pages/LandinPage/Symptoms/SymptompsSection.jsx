import React from 'react';
import styles from '../Symptoms/SymptompsSection.module.css';

function SymptomsSection() {
  const diseases = [
    "Bone Diseases", "Joint Diseases", "Pneumonia", "Lung Cancer", "Asthma",
    "Heart Cancer", "Heart Failure", "Brain Cancer", "Bowel Obstruction or Tumors",
    "Gallstones or Kidney Stones", "Cancerous Tumors", "Nervous System Disorders"
  ];

  return (
    <div className={styles.symptomContainer} id="Symptoms">
      <h1>Common Symptoms and Diseases You Can Check</h1>
      <p className={styles.description}>
        Explore a range of common symptoms the DocuS Symptom Checker can help you understand.
      </p>
      <div className={styles.buttons}>
        {diseases.map((disease, idx) => (
          <button className={styles.diseaseBtn} key={idx}>{disease}</button>
        ))}
      </div>
    </div>
  );
}

export default SymptomsSection;
