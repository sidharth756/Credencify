import { useState } from "react";
import styles from "./InstitutionForm.module.css";

const GW = "http://" + window.location.hostname + ":9000";

export default function InstitutionForm({ hideTitle = false, onSuccess }) {
    const [user] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [formData, setFormData] = useState({
        certificateId: "",
        learnerName: "",
        courseName: "",
        institutionName: user ? user.fullName : "",
        learnerEmail: "",
        institutionId: user ? user.userId : "",
        learnerId: ""
    });

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [issuedId, setIssuedId] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);
        setLoading(true);

        // Build payload — learnerEmail omitted (not required from form)
        const payload = {
            certificateId: formData.certificateId,
            learnerName: formData.learnerName,
            courseName: formData.courseName,
            institutionName: formData.institutionName,
            learnerEmail: "",   // kept as empty string for DB compatibility
            institutionId: formData.institutionId,
            learnerId: formData.learnerId
        };

        try {
            const response = await fetch(`${GW}/api/certificates`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setIssuedId(formData.certificateId);
                setMessage("✅ Certificate successfully issued and hash stored on blockchain!");
                setIsError(false);
                setFormData({
                    certificateId: "",
                    learnerName: "",
                    courseName: "",
                    institutionName: user ? user.fullName : "",
                    learnerEmail: "",
                    institutionId: user ? user.userId : "",
                    learnerId: ""
                });
                if (onSuccess) onSuccess();
            } else {
                const errorData = await response.json().catch(() => null);
                setMessage(errorData?.message || "Failed to issue certificate.");
                setIsError(true);
            }
        } catch (err) {
            console.error(err);
            setMessage("Failed to connect to the backend server.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {!hideTitle && (
                <>
                    <h1>Institution Portal</h1>
                    <p>Issue verifiable credentials by recording SHA-256 hashes on the Credencify Blockchain.</p>
                </>
            )}

            {message && (
                <div className={isError ? styles.errorBox : styles.successBox}>
                    <div>{message}</div>
                    {!isError && issuedId && (
                        <div style={{ marginTop: "12px", borderTop: "1px solid rgba(22, 163, 74, 0.2)", paddingTop: "10px" }}>
                            <span style={{ fontSize: "13px", color: "#166534" }}>Verification Link: </span>
                            <a 
                                href={`${window.location.protocol}//${window.location.host}/verify?id=${issuedId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.verificationLink}
                            >
                                {`${window.location.protocol}//${window.location.host}/verify?id=${issuedId}`}
                            </a>
                        </div>
                    )}
                </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label>Certificate ID *</label>
                    <input
                        type="text"
                        name="certificateId"
                        placeholder="e.g. CERT-1001"
                        value={formData.certificateId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Learner Name *</label>
                    <input
                        type="text"
                        name="learnerName"
                        placeholder="e.g. Alex Rivera"
                        value={formData.learnerName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Learner ID <span style={{fontWeight: 400, color: '#6b7280'}}>(e.g. L2026A001)</span></label>
                    <input
                        type="text"
                        name="learnerId"
                        placeholder="e.g. L2026A001"
                        value={formData.learnerId}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Course / Programme *</label>
                    <input
                        type="text"
                        name="courseName"
                        placeholder="e.g. Blockchain Development"
                        value={formData.courseName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Institution Name</label>
                    <input
                        type="text"
                        name="institutionName"
                        value={formData.institutionName}
                        readOnly
                        style={{ background: "#f0f4f8", cursor: "not-allowed", color: "#6b7280" }}
                    />
                </div>

                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? "Issuing..." : "Issue Credential"}
                </button>
            </form>
        </div>
    );
}