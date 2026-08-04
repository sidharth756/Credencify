import React, { useState } from "react";
import styles from "./Contact.module.css";

function Contact() {
  const [firstName, setFirstName] = useState("");

  return (
    <div className={styles.contact}>
      <label For="firstName">First Name</label>

      <input
        id="firstName"
        type="text"
        placeholder="Enter your first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
    </div>
  );
}

export default Contact;