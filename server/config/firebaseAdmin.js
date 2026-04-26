import admin from "firebase-admin";

// Provide your Firebase service account via one of these env vars:
//   FIREBASE_SERVICE_ACCOUNT_BASE64 — base64-encoded JSON of the service account key
//   FIREBASE_SERVICE_ACCOUNT_JSON   — raw JSON string of the service account key
//
// To get the key: Firebase console → Project Settings → Service Accounts → Generate new private key
// To base64-encode it: base64 -i serviceAccountKey.json | tr -d '\n'

if (!admin.apps.length) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const json = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      "base64"
    ).toString("utf-8");
    credential = admin.credential.cert(JSON.parse(json));
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    credential = admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    );
  } else {
    // Falls back to Application Default Credentials (Cloud Run / GCP environments)
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({ credential });
}

export default admin;
