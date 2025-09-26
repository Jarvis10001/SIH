import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TeacherProfile = () => {
  const [teacherData, setTeacherData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const teacher = JSON.parse(localStorage.getItem('teacherData') || '{}');
    setTeacherData(teacher);
    setFormData(teacher);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    setTeacherData(formData);
    localStorage.setItem('teacherData', JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(teacherData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {teacherData?.name?.charAt(0)?.toUpperCase() || 'T'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{teacherData?.name || 'Teacher Name'}</h1>
              <p className="text-gray-600">{teacherData?.designation || 'Designation'} • {teacherData?.department || 'Department'}</p>
              <p className="text-sm text-gray-500">ID: {teacherData?.teacherId || 'N/A'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isEditing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-[#4CAF50] text-white hover:bg-[#45a049]'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{teacherData?.name || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData?.email || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{teacherData?.email || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData?.phone || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{teacherData?.phone || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData?.dateOfBirth?.split('T')[0] || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">
                  {teacherData?.dateOfBirth ? new Date(teacherData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData?.address || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{teacherData?.address || 'Not provided'}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Professional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <p className="text-gray-900">{teacherData?.teacherId || 'Not provided'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="designation"
                  value={formData?.designation || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{teacherData?.designation || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData?.department || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{teacherData?.department || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
              {isEditing ? (
                <input
                  type="date"
                  name="joiningDate"
                  value={formData?.joiningDate?.split('T')[0] || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">
                  {teacherData?.joiningDate ? new Date(teacherData.joiningDate).toLocaleDateString() : 'Not provided'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              {isEditing ? (
                <input
                  type="number"
                  name="experience"
                  value={formData?.experience || ''}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{teacherData?.experience ? `${teacherData.experience} years` : 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
              {isEditing ? (
                <input
                  type="text"
                  name="subjects"
                  value={Array.isArray(formData?.subjects) ? formData.subjects.join(', ') : formData?.subjects || ''}
                  onChange={handleInputChange}
                  placeholder="Comma-separated subjects"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">
                  {Array.isArray(teacherData?.subjects) 
                    ? teacherData.subjects.join(', ') 
                    : teacherData?.subjects || 'Not provided'
                  }
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Academic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Academic Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            {isEditing ? (
              <input
                type="text"
                name="qualification"
                value={formData?.qualification || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{teacherData?.qualification || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={formData?.specialization || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{teacherData?.specialization || 'Not provided'}</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Research Interests</label>
            {isEditing ? (
              <textarea
                name="researchInterests"
                value={formData?.researchInterests || ''}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{teacherData?.researchInterests || 'Not provided'}</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Publications</label>
            {isEditing ? (
              <textarea
                name="publications"
                value={formData?.publications || ''}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{teacherData?.publications || 'Not provided'}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 justify-end"
        >
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg font-medium hover:bg-[#45a049] transition-colors"
          >
            Save Changes
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TeacherProfile;