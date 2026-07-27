function FeatureList() {
  const features = [
    "Blockchain Secured",
    "AI Fraud Detection",
    "Instant Credential Verification",
    "Trusted Digital Records",
  ];

  return (
    <div className="feature-list">
      {features.map((feature, index) => (
        <div className="feature-item" key={index}>
          <span className="tick">✔</span>
          <span>{feature}</span>
        </div>
      ))}
    </div>
  );
}

export default FeatureList;