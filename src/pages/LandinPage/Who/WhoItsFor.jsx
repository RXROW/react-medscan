import React from 'react';
import styles from '../Who/WhoItsFor.module.css';
import group from '../../../assets/images/landingPage/1.png';
import women from '../../../assets/images/landingPage/2.png';
import kids from '../../../assets/images/landingPage/3.png';
import man from '../../../assets/images/landingPage/4.png';

function WhoItsFor() {
  const cards = [
    {
      img: group,
      title: "Symptom Checker for Adults",
      desc: "Designed for adult health, helping to understand and manage a wide range of adult-specific symptoms."
    },
    {
      img: women,
      title: "Symptom Checker for Women",
      desc: "Our checker also provides detailed insights into symptoms commonly experienced by women."
    },
    {
      img: kids,
      title: "Child Symptom Checker",
      desc: "Helps parents and guardians understand and respond to health symptoms in kids."
    },
    {
      img: man,
      title: "Symptom Checker for Men",
      desc: "Designed for common men's health symptoms, addressing specific concerns with high accuracy."
    }
  ];

  return (
    <div className={styles.section} id="Who-it’s-for">
      <h2>Who It's For</h2>
      <p className={styles.description}>
        Medscan is made for those who want to understand their symptoms and navigate their health with confidence. Especially for:
      </p>
      <div className={styles.grid}>
        {cards.map((card, idx) => (
          <div className={styles.card} key={idx}>
            <div className={styles.iconWrapper}>
              <img src={card.img} alt={card.title} />
            </div>
            <div className={styles.text}>
              <h3 className={styles.title}>{card.title}</h3>
              <p className={styles.desc}>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhoItsFor;
