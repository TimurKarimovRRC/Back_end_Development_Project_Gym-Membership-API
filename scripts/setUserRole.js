require("dotenv").config();
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
}

async function main() {
  const userEmail = process.argv[2];
  const userRole = process.argv[3];

  if (!userEmail || !userRole) {
    console.error("Usage: node scripts/setUserRole.js user@example.com admin");
    process.exit(1);
  }

  try {
    const userRecord = await admin.auth().getUserByEmail(userEmail);

    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: userRole,
    });

    console.log(`Role '${userRole}' was set for ${userEmail}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to set user role:", error);
    process.exit(1);
  }
}

main();