'use client';

import { AuthUserDTO } from '@/src/application/dtos/backend/auth-users-dto';
import { AuthUsersViewModel } from '@/src/presentation/presenters/backend/auth-users/AuthUsersPresenter';
import Link from 'next/link';
import { useState } from 'react';

interface AuthUsersViewProps {
  viewModel: AuthUsersViewModel;
}

export function AuthUsersView({ viewModel }: AuthUsersViewProps) {
  const { authUsersData } = viewModel;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState('');

  const handleDelete = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้? การกระทำนี้ไม่สามารถยกเลิกได้')) {
      // TODO: Implement delete functionality
      console.log('Delete user:', id);
    }
  };

  const handleResendConfirmation = async (id: string) => {
    // TODO: Implement resend confirmation functionality
    console.log('Resend confirmation:', id);
  };

  const filteredUsers = authUsersData.users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
    const matchesProvider = filterProvider === '' ||
      user.appMetadata.provider === filterProvider;
    return matchesSearch && matchesProvider;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProviderBadge = (provider?: string) => {
    const providerColors: Record<string, string> = {
      email: 'bg-blue-100 text-blue-800',
      google: 'bg-red-100 text-red-800',
      facebook: 'bg-blue-100 text-blue-800',
      apple: 'bg-gray-100 text-gray-800',
      phone: 'bg-green-100 text-green-800'
    };

    const color = providerColors[provider || 'email'] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {provider || 'email'}
      </span>
    );
  };

  const getStatusBadge = (user: AuthUserDTO) => {
    if (user.emailConfirmedAt) {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">ยืนยันแล้ว</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">รอยืนยัน</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold backend-text">จัดการผู้ใช้งาน</h1>
          <p className="backend-text-muted mt-2">ระบบจัดการผู้ใช้งานและการตรวจสอบยืนยันตัวตน</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            ส่งออกข้อมูล
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            รายงานผู้ใช้
          </button>
        </div>
      </div>

      {/* Provider Distribution */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <h3 className="text-lg font-semibold backend-text mb-4">การกระจายตาม Provider</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{authUsersData.stats.usersByProvider.email}</p>
            <p className="backend-text-muted text-sm">Email</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{authUsersData.stats.usersByProvider.google}</p>
            <p className="backend-text-muted text-sm">Google</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{authUsersData.stats.usersByProvider.facebook}</p>
            <p className="backend-text-muted text-sm">Facebook</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">{authUsersData.stats.usersByProvider.apple}</p>
            <p className="backend-text-muted text-sm">Apple</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{authUsersData.stats.usersByProvider.phone}</p>
            <p className="backend-text-muted text-sm">Phone</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{authUsersData.stats.usersByProvider.anonymous}</p>
            <p className="backend-text-muted text-sm">Anonymous</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาด้วยอีเมล หรือเบอร์โทร..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
            />
          </div>
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุก Provider</option>
            <option value="email">Email</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
            <option value="apple">Apple</option>
            <option value="phone">Phone</option>
            <option value="anonymous">Anonymous</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">เรียงตาม</option>
            <option value="email">อีเมล</option>
            <option value="created_at">วันที่สร้าง</option>
            <option value="last_sign_in_at">เข้าใช้ล่าสุด</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <h2 className="text-xl font-semibold backend-text mb-4">รายการผู้ใช้งาน</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">ผู้ใช้</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">Provider</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">สถานะ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">เข้าใช้ล่าสุด</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">วันที่สร้าง</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div>
                        <div className="backend-text font-medium">{user.email}</div>
                        {user.phone && (
                          <div className="backend-text-muted text-sm">{user.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getProviderBadge(user.appMetadata.provider)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(user)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="backend-text-muted text-sm">
                        {formatDate(user.lastSignInAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="backend-text-muted text-sm">
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/backend/auth-users/${user.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          ดูรายละเอียด
                        </Link>
                        <button className="text-green-600 hover:text-green-800 text-sm">
                          แก้ไข
                        </button>
                        {!user.emailConfirmedAt && (
                          <button 
                            onClick={() => handleResendConfirmation(user.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            ส่งอีเมลยืนยัน
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="backend-text-muted text-sm">
          แสดง 1-{filteredUsers.length} จาก {authUsersData.totalCount} รายการ
        </p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">ก่อนหน้า</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">2</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">3</button>
          <button className="px-3 py-1 border backend-sidebar-border rounded backend-text-muted hover:backend-text">ถัดไป</button>
        </div>
      </div>
    </div>
  );
}
