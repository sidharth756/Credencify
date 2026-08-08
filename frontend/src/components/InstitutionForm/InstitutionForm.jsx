import { useState } from "react";
import styles from "./InstitutionForm.module.css";

export default function InstitutionForm() {

    const [formData, setFormData] = useState({
        certificateId: "",
        learnerName: "",
        courseName: "",
        institutionName: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8051/api/certificates",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.text();
            alert(data);

        } catch (err) {
            console.error(err);
            alert("Failed to connect backend.");

        }
    };

    return (

        <div className={styles.container}>
            <h1>Institution Portal</h1>
            <p>
                Issue verifiable credentials by recording SHA-256 hashes
                on the Credencify Blockchain
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <label>Certificate ID</label>

                <input type="text" name="certificateId" placeholder="e.g. 1001"
                    value={formData.certificateId} onChange={handleChange} required
                />

                <label>Learner Name</label>

                <input
                    type="text" name="leanerName" placeholder="e.g. Alex Rivera"
                    value={formData.leanerName} onChange={handleChange} required
                />

                <label>Course Name</label>

                <input
                    type="text" name="courseName"  placeholder="e.g. Full Stack Web Development"
                    value={formData.courseName} onChange={handleChange}
                    required
                />

                <label>Institution Name</label>

                <input
                    type="text" name="institutionName" placeholder="e.g. Harvard University"
                    value={formData.institutionName} onChange={handleChange} required
                />

                <button className={styles.button} type="submit">
                    Issue Credential
                </button>

            </form>

        </div>

    );

}