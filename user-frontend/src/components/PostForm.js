import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PostForm = ({ post = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: post?.title || '',
    subjects: post?.subjects || [],
    locations: post?.locations || [],
    fee: post?.fee || '',
    experience: post?.experience || '',
    education: post?.education || '',
    description: post?.description || '',
    genderPreference: post?.genderPreference || 'any'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayChange = (e, field) => {
    const values = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = '請輸入標題';
    if (!formData.subjects.length) newErrors.subjects = '請輸入科目';
    if (!formData.locations.length) newErrors.locations = '請輸入地區';
    if (!formData.fee) newErrors.fee = '請輸入堂費';
    if (!formData.experience.trim()) newErrors.experience = '請輸入教學經驗';
    if (!formData.education.trim()) newErrors.education = '請輸入學歷';
    if (!formData.description.trim()) newErrors.description = '請輸入詳細介紹';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (post) {
        await api.patch(`/api/posts/${post._id}`, formData);
      } else {
        await api.post('/api/posts/tutor', formData);
      }
      alert(post ? '貼文已更新' : '貼文已發佈，等待審核');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || '操作失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{post ? '編輯貼文' : '發佈招學生貼文'}</h2>
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
          <label className="block text-sm font-medium text-gray-700">科目（用逗號分隔）</label>
          <input
            type="text"
            value={formData.subjects.join(', ')}
            onChange={(e) => handleArrayChange(e, 'subjects')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.subjects && <p className="mt-1 text-sm text-red-600">{errors.subjects}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">地區（用逗號分隔）</label>
          <input
            type="text"
            value={formData.locations.join(', ')}
            onChange={(e) => handleArrayChange(e, 'locations')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.locations && <p className="mt-1 text-sm text-red-600">{errors.locations}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">堂費（每小時）</label>
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
          <label className="block text-sm font-medium text-gray-700">教學經驗</label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">學歷</label>
          <textarea
            name="education"
            value={formData.education}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">詳細介紹</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">性別偏好</label>
          <select
            name="genderPreference"
            value={formData.genderPreference}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="any">不限</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? '處理中...' : (post ? '更新貼文' : '發佈貼文')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm; 