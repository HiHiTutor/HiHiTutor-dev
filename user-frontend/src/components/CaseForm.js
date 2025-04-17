import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CaseForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    location: '',
    fee: '',
    requirements: '',
    schedule: '',
    contact: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = '請輸入標題';
    if (!formData.subject.trim()) newErrors.subject = '請選擇科目';
    if (!formData.location.trim()) newErrors.location = '請輸入上課地區';
    if (!formData.fee.trim()) newErrors.fee = '請輸入堂費';
    if (!formData.requirements.trim()) newErrors.requirements = '請輸入要求';
    if (!formData.schedule.trim()) newErrors.schedule = '請輸入上課時間';
    if (!formData.contact.trim()) newErrors.contact = '請輸入聯絡方式';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await api.post('/api/cases', formData);
      alert('個案發佈成功！');
      navigate('/cases');
    } catch (err) {
      alert(err.response?.data?.message || '發佈失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除對應欄位的錯誤
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">發佈補習個案</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">標題</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">科目</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">請選擇科目</option>
            <option value="數學">數學</option>
            <option value="英文">英文</option>
            <option value="中文">中文</option>
            <option value="物理">物理</option>
            <option value="化學">化學</option>
            <option value="生物">生物</option>
          </select>
          {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">上課地區</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">堂費 (每小時)</label>
          <input
            type="number"
            name="fee"
            value={formData.fee}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.fee && <p className="mt-1 text-sm text-red-600">{errors.fee}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">要求</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">上課時間</label>
          <input
            type="text"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            placeholder="例如：每週二、四 晚上 7-9 點"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.schedule && <p className="mt-1 text-sm text-red-600">{errors.schedule}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">聯絡方式</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="電話或 WhatsApp"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? '發佈中...' : '發佈個案'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseForm; 