import styles from "./ChatWithUS.module.css";

function ChatWithUS() {
  return (
    <div className={styles.container}>
        
      <div className={styles.section}>
        <h2>CHAT WITH US</h2>
        <p className={styles.subtitle}>Speak to our support team</p>

        <p className={styles.link}>
          <a href="mailto:support@example.com">Shoot us an email</a>
        </p>

        <p className={styles.link}>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message us on X
          </a>
        </p>
      </div>

     
      <div className={styles.section}>
        <h2>CALL US</h2>
        <p className={styles.subtitle}>
          Available 24/7 for your support
        </p>

        <p className={styles.phone}>+91 422 234 5678</p>
      </div>

      <div className={styles.section}>
        <h2>OFFICE LOCATION</h2>
        <p className={styles.subtitle}>Visit Our Office</p>

        <p className={styles.address}>
          Innovation Hub, Tidal Park
          <br />
          Coimbatore, Tamil Nadu 641014
          <br />
          India
        </p>
      </div>
    </div>
  );
}

export default ChatWithUS;