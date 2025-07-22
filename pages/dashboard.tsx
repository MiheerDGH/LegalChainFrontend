import React from 'react';
import DocumentUploader from '../components/DocumentUploader';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Documents</h1>
      <DocumentUploader onUploadComplete={() => {}} />
    </div>
  );
};

export default Dashboard;
