import React, { useState } from "react";
import styles from "./Contact.module.css";

function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div className={styles.contact}>
     
      <label For="firstName">First Name</label>

      <input
        id="firstName"
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

       <label For="lastName">Last Name</label>

      <input
        id="lastName"
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

        <label For="email">Email</label>

      <input
        id="email"
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label For="phone number">Phone Number</label>

      <input
        id="phone number"
        type="tel"
        placeholder="+91 XXXXX XXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label For="Message">Message</label>

      <input
        id="message"
        type="text"
        placeholder="Leave us a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

        <button type="submit">Send</button>
      
      

    </div>
  );
}

export default Contact;