import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedCases, setAppliedCases] = useState([]);
  const { user } = useAuth();

  const fetchCases = async () => {
    try {
      const response = await axios.get('/api/cases?verified=true');
      setCases(response.data);
    } catch (error) {
      setError('Error fetching cases');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedCases = async () => {
    try {
      const response = await axios.get('/api/cases/applied');
      setAppliedCases(response.data);
    } catch (error) {
      console.error('Error fetching applied cases:', error);
    }
  };

  const handleApply = async (caseId) => {
    try {
      await axios.post(`/api/cases/${caseId}/apply`);
      fetchAppliedCases();
      alert('Application submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error applying for case');
    }
  };

  const getApplicationStatus = (caseId) => {
    const application = appliedCases.find(app => app.case._id === caseId);
    return application ? application.status : null;
  };

  useEffect(() => {
    fetchCases();
    if (user) {
      fetchAppliedCases();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Available Cases</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((caseItem) => {
          const applicationStatus = getApplicationStatus(caseItem._id);
          const canViewContact = user && (
            user._id === caseItem.student._id ||
            applicationStatus === 'approved'
          );

          return (
            <div key={caseItem._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{caseItem.title}</h3>
              <p className="text-gray-600 mb-2">Subject: {caseItem.subject}</p>
              <p className="text-gray-600 mb-2">Location: {caseItem.location}</p>
              <p className="text-gray-600 mb-2">Fee: ${caseItem.fee}/hour</p>
              <p className="text-gray-600 mb-4">Requirements: {caseItem.requirements}</p>
              
              {canViewContact ? (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Contact Information:</h4>
                  <p className="text-gray-600">Schedule: {caseItem.schedule}</p>
                  <p className="text-gray-600">Contact: {caseItem.contact}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic mb-4">
                  Contact information will be available after your application is approved
                </p>
              )}

              {user && user.role === 'tutor' && !applicationStatus && (
                <button
                  onClick={() => handleApply(caseItem._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              )}

              {applicationStatus && (
                <div className={`mt-2 p-2 rounded ${
                  applicationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                  applicationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Status: {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaseList; 