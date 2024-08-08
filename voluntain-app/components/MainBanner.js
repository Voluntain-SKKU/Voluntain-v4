import styles from '../styles/Home.module.css'

export const MainBanner = () => {
  return (
    <div className={styles.mainwrapper}>
    <div className={styles.banner} style={{backgroundColor: "#0e341b"}}>
      <div className={styles.maintitle}>VOLUNTAIN</div>
      <div className={styles.slogan}>
        Study All Together, Voluntain!  
      </div>
    </div>
    </div>
  );
};
