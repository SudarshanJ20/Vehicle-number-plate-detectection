import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Save Detection ────────────────────────────────────────────────────────────
export const saveDetection = async (userId, detectionData) => {
  const {
    plateText,
    state,
    plateType,
    detectionConfidence,
    ocrConfidence,
    filename,
  } = detectionData;

  // Save to detections collection
  const docRef = await addDoc(collection(db, "detections"), {
    userId,
    plateText,
    state,
    plateType,
    detectionConfidence,
    ocrConfidence,
    filename: filename || "unknown",
    createdAt: serverTimestamp(),
  });

  // Increment user's total detection count
  await updateDoc(doc(db, "users", userId), {
    totalDetections: increment(1),
  });

  return docRef.id;
};

// ── Get User Detections ───────────────────────────────────────────────────────
export const getUserDetections = async (userId, limitCount = 50) => {
  const q = query(
    collection(db, "detections"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
  }));
};

// ── Get User Stats ────────────────────────────────────────────────────────────
export const getUserStats = async (userId) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  const detections = await getUserDetections(userId, 500);

  const statsByState = detections.reduce((acc, d) => {
    acc[d.state] = (acc[d.state] || 0) + 1;
    return acc;
  }, {});

  const avgConfidence =
    detections.length > 0
      ? detections.reduce((sum, d) => sum + d.detectionConfidence, 0) /
        detections.length
      : 0;

  return {
    totalDetections: userDoc.data()?.totalDetections || 0,
    avgConfidence: avgConfidence.toFixed(1),
    topState: Object.entries(statsByState).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A",
    statsByState,
    recentDetections: detections.slice(0, 5),
  };
};
