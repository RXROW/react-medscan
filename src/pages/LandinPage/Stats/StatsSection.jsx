import React from 'react';
import styles from '../Stats/StatsSection.module.css';
import worldMap from '../../../assets/images/landingPage/worldMap.png';
import sora1 from '../../../assets/images/landingPage/one.png';
import sora2 from '../../../assets/images/landingPage/two.png';
import sora3 from '../../../assets/images/landingPage/three.png';
import sora4 from '../../../assets/images/landingPage/four.png';
import sora5 from '../../../assets/images/landingPage/five.png';


function Statistics() {
  return (
    <div className={styles.dataContainer} id="Statistics">
      <div className={styles.dataStats}>
        <div className={styles.dataStat}>
          <div className={styles.dataStatText}>
            <span className={styles.dataDot}></span>
            <h1>14,096,691</h1>
            <p>users</p>
          </div>
        </div>
        <div className={styles.dataStat}>
          <div className={styles.dataStatText}>
            <span className={styles.dataDot}></span>
            <h1>34,666,189</h1>
            <p>symptom assessments</p>
          </div>
        </div>
      </div>

      <div className={styles.dataMapSection}>
        <img src={worldMap} alt="World Map" className={styles.dataWorldMap} />
        <div className={styles.dataTestimonial}>
          <p>
            “I was skeptical while downloading it, but after using it and seeing the assessment, 
            it helped monitor a condition easily.”
          </p>
          <p className={styles.dataDisclaimer}>
            These are unaltered publicly available third-party statements and not claims from Ada.
          </p>
        </div>
      </div>

      <div className={styles.dataFeatures}>
        {[
          { img: sora1, text: "Most popular symptom assessment app" },
          { img: sora2, text: "Optimized with human doctors" },
          { img: sora3, text: "Medical guidance in your language" },
          { img: sora4, text: "Supporting pandemic responses" },
          { img: sora5, text: "Most comprehensive condition coverage" }
        ].map((feature, idx) => (
          <div className={styles.dataFeature} key={idx}>
            <img src={feature.img} alt="Feature Icon" className={styles.dataFeatureIcon} />
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Statistics;
