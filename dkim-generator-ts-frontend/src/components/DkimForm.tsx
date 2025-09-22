import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconDownload, IconKey } from "@tabler/icons-react";
// import "@tabler/core/dist/css/tabler.min.css";

interface DkimKeys {
  privateKey: string;
  publicKey: string;
  dkimRecord: string;
}

const DkimForm: React.FC = () => {
  const [selector, setSelector] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [keySize, setKeySize] = useState<number>(2048);
  const [result, setResult] = useState<string>("");
  const [keys, setKeys] = useState<DkimKeys | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    setSelector(`csod${day}${month}${year}`);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setKeys(null);

    try {
      const response = await axios.post<DkimKeys>(
        "http://localhost:5000/api/dkim/generate",
        { selector, domain, keySize }
      );
      setResult(response.data.dkimRecord);
      setKeys(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrapper">
      <div className="container-xl py-4">
        <h2 className="mb-4">DKIM Key Generator</h2>
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="mb-3">
            <label className="form-label">Selector:</label>
            <input
              className="form-control"
              type="text"
              value={selector}
              disabled
            />
          </div>
          <div className="mb-3 w-100 mw-300">
            <label className="form-label">Key Size: {keySize}</label>
            <input
              className="form-range"
              type="range"
              min="1024"
              max="2048"
              step="1024"
              value={keySize}
              onChange={(e) => setKeySize(Number(e.target.value))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Domain:</label>
            <input
              className="form-control"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
          </div>
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate DKIM Keys"}
          </button>
        </form>

        {loading && (
          <div className="alert alert-info mt-3 text-center">
            Generating Key...
          </div>
        )}

        {result && (
          <div className="card mt-3 p-3">
            <pre className="mb-0">{result}</pre>
          </div>
        )}

        {keys && (
          <div className="mt-3 d-flex gap-2 flex-wrap">
            <button
              className="btn btn-success d-flex align-items-center gap-1"
              onClick={() =>
                downloadFile(
                  keys.privateKey,
                  `${selector}._domainkey.${domain}.pem`
                )
              }
            >
              <IconKey size={20} />
              Private Key
            </button>

            <button
              className="btn btn-success d-flex align-items-center gap-1"
              onClick={() => {
                const cleanKey = keys.publicKey
                  .replace(/-----BEGIN PUBLIC KEY-----/, "")
                  .replace(/-----END PUBLIC KEY-----/, "")
                  .replace(/\r?\n|\r/g, "");

                const fileContent = `${selector}._domainkey.${domain}\nRSA KEY:${cleanKey}`;
                downloadFile(fileContent, `${selector}._domainkey.${domain}.txt`);
              }}
            >
              <IconDownload size={20} />
              Public Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DkimForm;
