import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DkimForm.css";

export default function DkimForm() {
  const [selector, setSelector] = useState("");
  const [domain, setDomain] = useState("");
  const [keySize, setKeySize] = useState(2048);
  const [result, setResult] = useState("");
  const [keys, setKeys] = useState(null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    setSelector(`csod${day}${month}${year}`);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setKeys(null);
    try {
      const response = await axios.post("http://localhost:5000/api/dkim/generate", {
        selector,
        domain,
        keySize,
      });
      setResult(response.data.dkimRecord);
      setKeys(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <h2 className="heading">DKIM Key Generator</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="label">Selector:</label>
          <input
            className="input"
            type="text"
            value={selector}
            disabled 
          />
        </div>
        <div className="form-group">
          <label className="label">Key Size: {keySize}</label>
          <input
            className="range"
            type="range"
            min="1024"
            max="2048"
            step="1024"
            value={keySize}
            onChange={(e) => setKeySize(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="label">Domain:</label>
          <input
            className="input"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />
        </div>
        <button className="button-primary" type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate DKIM Keys"}
        </button>
      </form>

      {loading && (
        <div className="loader">Generating Key...</div>
      )}

      {result && (
        <div className="result">
          <pre>{result}</pre>
        </div>
      )}

      {keys && (
        <div className="download-buttons">
          <button
            className="button-secondary"
            onClick={() =>
              downloadFile(keys.privateKey, `${selector}._domainkey.${domain}.pem`)
            }
          >
            Download Private Key
          </button>

          <button
            className="button-secondary"
            onClick={() => {
              const cleanKey = keys.publicKey
                .replace(/-----BEGIN PUBLIC KEY-----/, "")
                .replace(/-----END PUBLIC KEY-----/, "")
                .replace(/\r?\n|\r/g, "");

              const fileContent = `${selector}._domainkey.${domain}\nRSA KEY:${cleanKey}`;

              downloadFile(fileContent, `${selector}._domainkey.${domain}.txt`);
            }}
          >
            Download Public Key
          </button>
        </div>
      )}
    </div>
  );
}
