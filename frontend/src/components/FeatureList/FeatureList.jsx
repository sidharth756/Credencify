import styles from "./FeatureList.module.css";

function FeatureList() {

    const features = [
        "Blockchain Secured Credentials",
        "AI Powered Fraud Detection",
        "Instant Credential Verification",
        "Trusted Digital Records"
    ];


    return (
        <div className={styles.features}>
            {
                features.map((feature, index) => (
                    <div 
                        key={index} 
                        className={styles.featureItem}
                    >
                        <span className={styles.check}>
                            ✓
                        </span>

                        <p>
                            {feature}
                        </p>

                    </div>
                ))
            }
        </div>
    );
}
export default FeatureList;