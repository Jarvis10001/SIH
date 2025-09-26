import React from 'react';

const TestComponent = () => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold">Tailwind CSS Test</h1>
      <p className="mt-2">If you can see this styled properly, Tailwind is working!</p>
      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4 transition-colors">
        Test Button
      </button>
    </div>
  );
};

export default TestComponent;