// API 相關工具函數

const API_BASE_URL = 'https://hihitutor-backend.onrender.com';

/**
 * 獲取文件的完整 URL
 * @param {string} filePath - 文件路徑
 * @returns {string} 完整的文件 URL
 */
export const getFileUrl = (filePath) => {
  if (!filePath) return '';
  if (filePath.startsWith('http')) return filePath;
  
  // 解碼路徑（如果已經被編碼）
  const decodedPath = decodeURIComponent(filePath);
  
  // 移除開頭的 /uploads（如果有）
  const normalizedPath = decodedPath.replace(/^\/uploads\//, '');
  
  return `${API_BASE_URL}/uploads/${normalizedPath}`;
}; 