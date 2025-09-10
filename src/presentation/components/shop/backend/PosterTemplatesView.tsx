'use client';

import type { PosterTemplate, PosterTemplateFilters } from '@/src/application/services/shop/backend/poster-templates-backend-service';
import type { PosterTemplatesViewModel } from '@/src/presentation/presenters/shop/backend/PosterTemplatesPresenter';
import { useState } from 'react';

interface PosterTemplatesViewProps {
  viewModel: PosterTemplatesViewModel;
}

export function PosterTemplatesView({ viewModel }: PosterTemplatesViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PosterTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<PosterTemplateFilters>(viewModel.filters);

  const { templates, stats, categoryOptions, orientationOptions, difficultyOptions } = viewModel;

  const handleFilterChange = (key: keyof PosterTemplateFilters, value: string) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
    setFilters(newFilters);
    // In real implementation, this would trigger a refetch
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'draft':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryOption = categoryOptions.find(opt => opt.value === category);
    return categoryOption?.color || 'gray';
  };

  const getDifficultyColor = (difficulty: string) => {
    const difficultyOption = difficultyOptions.find(opt => opt.value === difficulty);
    return difficultyOption?.color || 'gray';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">แม่แบบโปสเตอร์</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">จัดการแม่แบบโปสเตอร์สำหรับสร้างโปสเตอร์</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            🎨 สร้างแม่แบบ
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">แม่แบบทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalTemplates}</p>
              <p className="text-sm font-medium text-gray-600">เทมเพลตทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTemplates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">เทมเพลตที่ใช้งาน</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeTemplates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">👁️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ยอดการใช้งาน</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsage.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">คะแนนเฉลี่ย</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ตัวกรอง</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
            <select
              value={filters.category || 'all'}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">ทั้งหมด</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Orientation Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">การวางแนว</label>
            <select
              value={filters.orientation || 'all'}
              onChange={(e) => handleFilterChange('orientation', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">ทั้งหมด</option>
              {orientationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ระดับความยาก</label>
            <select
              value={filters.difficulty || 'all'}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">ทั้งหมด</option>
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">ทั้งหมด</option>
              <option value="active">ใช้งาน</option>
              <option value="inactive">ไม่ใช้งาน</option>
              <option value="draft">ร่าง</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Template Preview */}
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg p-4 relative">
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(template.status)}`}>
                  {template.status === 'active' ? 'ใช้งาน' : template.status === 'inactive' ? 'ไม่ใช้งาน' : 'ร่าง'}
                </span>
              </div>
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎨</div>
                  <div className="text-sm text-gray-600">{template.name}</div>
                </div>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-1">⭐</span>
                  <span>{template.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getCategoryColor(template.category)}-100 text-${getCategoryColor(template.category)}-600`}>
                    {categoryOptions.find(opt => opt.value === template.category)?.label || template.category}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getDifficultyColor(template.difficulty)}-100 text-${getDifficultyColor(template.difficulty)}-600`}>
                    {difficultyOptions.find(opt => opt.value === template.difficulty)?.label || template.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>👁️ {template.usageCount.toLocaleString()}</span>
                <span>{orientationOptions.find(opt => opt.value === template.orientation)?.icon} {template.orientation}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowPreview(true);
                  }}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  ดูตัวอย่าง
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  ใช้งาน
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  ⋯
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่พบเทมเพลต</h3>
          <p className="text-gray-600 mb-4">ลองปรับเปลี่ยนตัวกรองหรือสร้างเทมเพลตใหม่</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            สร้างเทมเพลตแรก
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">ตัวอย่างเทมเพลต: {selectedTemplate.name}</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Template Preview */}
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <div className="text-xl font-semibold text-gray-800">{selectedTemplate.name}</div>
                    <div className="text-gray-600 mt-2">ตัวอย่างเทมเพลต</div>
                  </div>
                </div>

                {/* Template Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">รายละเอียด</h3>
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">ข้อมูลเทมเพลต</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">หมวดหมู่:</span>
                        <span>{categoryOptions.find(opt => opt.value === selectedTemplate.category)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">การวางแนว:</span>
                        <span>{orientationOptions.find(opt => opt.value === selectedTemplate.orientation)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ระดับความยาก:</span>
                        <span>{difficultyOptions.find(opt => opt.value === selectedTemplate.difficulty)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">คะแนน:</span>
                        <span>⭐ {selectedTemplate.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ยอดการใช้งาน:</span>
                        <span>{selectedTemplate.usageCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">ตัวแปรที่ใช้ได้</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      ใช้เทมเพลตนี้
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      ทำสำเนา
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">สร้างเทมเพลตใหม่</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อเทมเพลต</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ใส่ชื่อเทมเพลต"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">คำอธิบาย</label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="อธิบายเทมเพลตนี้"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">การวางแนว</label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      {orientationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    สร้างเทมเพลต
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
