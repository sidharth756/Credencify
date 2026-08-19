import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Contact.module.css";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiTwitter,
  FiSend,
  FiChevronDown,
  FiChevronUp,
  FiMessageSquare,
} from "react-icons/fi";

const faqs = [
  {
    q: "How long does it take to receive a response?",
    a: "Most inquiries are answered within 24–48 business hours.",
  },
  {
    q: "Is my personal information secure?",
    a: "Yes. We follow industry-standard encryption and never share your data with third parties.",
  },
  {
    q: "Can I verify multiple credentials?",
    a: "Absolutely. You can verify as many credentials as you need through our public verification portal.",
  },
  {
    q: "Is there a fee for verification?",
    a: "Verification is completely free for employers and the public. Institutions pay a small issuance fee.",
  },
  {
    q: "Is the service available 24/7?",
    a: "Yes. The verification platform is online 24/7. Support responses are within business hours.",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* PAGE HEADER */}
      <div className={styles.pageHeader}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          Get In Touch
        </div>
        <h1 className={styles.pageTitle}>Need help? Contact Our Team.</h1>
        <p className={styles.pageSub}>
          Reach out for support, partnerships, or inquiries.<br />
          Our team is ready to assist you every step of the way.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContent}>

        {/* LEFT: FORM */}
        <div className={styles.formCard}>
          {sent && (
            <div className={styles.successBanner}>
              ✅ Message sent! We'll get back to you shortly.
            </div>
          )}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className={styles.field}>
              <label>Phone number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9000000000"
              />
            </div>
            <div className={styles.field}>
              <label>Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Leave us a message..."
                rows={4}
                required
              />
            </div>
            <button type="submit" className={styles.sendBtn}>
              <FiSend size={16} />
              Send Message
            </button>
          </form>
        </div>

        {/* RIGHT: CONTACT INFO */}
        <div className={styles.infoPanel}>
          <div className={styles.infoCard}>
            <div className={styles.infoIconBox}>
              <FiMessageSquare size={20} color="#1d4ed8" />
            </div>
            <div>
              <div className={styles.infoLabel}>CHAT WITH US</div>
              <div className={styles.infoTitle}>Speak to our friendly team</div>
              <div className={styles.infoLinks}>
                <a href="mailto:contact@credencify.in"><FiMail size={14} /> contact@credencify.in</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer"><FiTwitter size={14} /> Message us on X</a>
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIconBox}>
              <FiPhone size={20} color="#1d4ed8" />
            </div>
            <div>
              <div className={styles.infoLabel}>CALL US</div>
              <div className={styles.infoTitle}>Mon–Fri, 9am – 6pm IST</div>
              <div className={styles.infoLinks}>
                <a href="tel:+914122345678"><FiPhone size={14} /> +91 422 234 5678</a>
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIconBox}>
              <FiMapPin size={20} color="#1d4ed8" />
            </div>
            <div>
              <div className={styles.infoLabel}>OFFICE LOCATION</div>
              <div className={styles.infoTitle}>Visit Our Office</div>
              <div className={styles.infoAddress}>
                Innovation Hub, Tidel park<br />
                Coimbatore, TamilNadu 641014<br />
                India
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className={styles.faqSection}>
        <div className={styles.faqContainer}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ""}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <span className={styles.faqNum}>Q</span>
                  <span>{faq.q}</span>
                  {openFaq === i ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </button>
                {openFaq === i && (
                  <div className={styles.faqAnswer}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}