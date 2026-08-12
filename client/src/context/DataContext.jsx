import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [overview, setOverview] = useState(null);
  const [riskDistribution, setRiskDistribution] = useState(null);
  const [gradeDistribution, setGradeDistribution] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [studentsRes, overviewRes, riskRes, gradeRes, trendsRes] = await Promise.all([
        api.students.getAll(),
        api.analytics.getOverview(),
        api.analytics.getRiskDistribution(),
        api.analytics.getGradeDistribution(),
        api.analytics.getTrends(),
      ]);
      setStudents(studentsRes);
      setOverview(overviewRes);
      setRiskDistribution(riskRes);
      setGradeDistribution(gradeRes);
      setTrends(trendsRes);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const createIntervention = async (studentId, data) => {
    const intervention = await api.students.createIntervention(studentId, data);
    await fetchAll();
    return intervention;
  };

  const updateIntervention = async (id, data) => {
    const intervention = await api.interventions.update(id, data);
    await fetchAll();
    return intervention;
  };

  const sendChat = async (message, userId) => {
    return api.chat.send(message, userId);
  };

  return (
    <DataContext.Provider value={{
      students,
      overview,
      riskDistribution,
      gradeDistribution,
      trends,
      loading,
      error,
      refetch: fetchAll,
      createIntervention,
      updateIntervention,
      sendChat,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}