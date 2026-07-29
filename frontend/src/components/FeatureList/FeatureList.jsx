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
                            <img width="48" height="48" src="https://img.icons8.com/material-outlined/48/16a34a/checked--v1.png" alt="checked--v1"/>
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