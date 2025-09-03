import crypto from "crypto";

// Helper functions to convert keys to PEM
function convertToPem(type, keyBuffer) {
  const base64 = keyBuffer.toString("base64");
  const lines = base64.match(/.{1,64}/g).join("\n");
  return `-----BEGIN ${type}-----\n${lines}\n-----END ${type}-----`;
}

export const generateDKIMKeys = (req, res) => {
  try {
    const { selector, domain, keySize = 2048 } = req.body;
    if (!selector || !domain) {
      return res.status(400).json({ error: "Selector and domain are required" });
    }

    // Generating RSA key pair
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: keySize,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });

    // Extracting base64 portion for DNS record
    const publicKeyBase64 = publicKey
      .split("\n")
      .filter(line => !line.includes("BEGIN") && !line.includes("END"))
      .join("");

    // Building DKIM record
    const dkimRecord = `${selector}._domainkey.${domain} "v=DKIM1; k=rsa; p=${publicKeyBase64}"`;

    return res.json({
      privateKey,
      publicKey,
      dkimRecord
    });
  } catch (error) {
    console.error("Error generating DKIM keys:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
