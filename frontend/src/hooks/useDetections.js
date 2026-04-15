import { useState } from "react";
import { saveDetection, getUserDetections, getUserStats } from "../firebase/detections";
import { useAuth } from "../context/AuthContext";

export const useDetections = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const save = async (detectionData) => {
    if (!user) return null;
    setLoading(true);
    setError(null);
    try {
      const id = await saveDetection(user.uid, detectionData);
      return id;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (limitCount = 50) => {
    if (!user) return [];
    setLoading(true);
    setError(null);
    try {
      const detections = await getUserDetections(user.uid, limitCount);
      return detections;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return null;
    setLoading(true);
    try {
      const stats = await getUserStats(user.uid);
      return stats;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { save, fetchHistory, fetchStats, loading, error };
};
