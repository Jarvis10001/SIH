// Data service - handles sample data operations
let sampleData = [
  { id: 1, name: 'Sample Data 1', type: 'example', description: 'This is sample data for testing' },
  { id: 2, name: 'Sample Data 2', type: 'demo', description: 'Another sample for demonstration' },
  { id: 3, name: 'Sample Data 3', type: 'test', description: 'Test data for API endpoints' }
];

let nextDataId = 4;

// Get all sample data
const getAllData = () => {
  return sampleData.map(item => ({ ...item }));
};

// Get data by ID
const getDataById = (id) => {
  const item = sampleData.find(item => item.id === parseInt(id));
  return item ? { ...item } : null;
};

// Get data by type
const getDataByType = (type) => {
  return sampleData.filter(item => item.type === type.toLowerCase());
};

// Create new data
const createData = (dataInfo) => {
  const newData = {
    id: nextDataId++,
    name: dataInfo.name,
    type: dataInfo.type || 'general',
    description: dataInfo.description || '',
    createdAt: new Date()
  };
  
  sampleData.push(newData);
  return { ...newData };
};

// Update data
const updateData = (id, dataInfo) => {
  const dataIndex = sampleData.findIndex(item => item.id === parseInt(id));
  if (dataIndex === -1) {
    return null;
  }

  sampleData[dataIndex] = {
    ...sampleData[dataIndex],
    ...dataInfo,
    updatedAt: new Date()
  };
  
  return { ...sampleData[dataIndex] };
};

// Delete data
const deleteData = (id) => {
  const dataIndex = sampleData.findIndex(item => item.id === parseInt(id));
  if (dataIndex === -1) {
    return false;
  }

  sampleData.splice(dataIndex, 1);
  return true;
};

module.exports = {
  getAllData,
  getDataById,
  getDataByType,
  createData,
  updateData,
  deleteData
};
