'use client';

import { ProfilesViewModel } from '@/src/presentation/presenters/backend/profiles/ProfilesPresenter';
import { useProfilesPresenter } from '@/src/presentation/presenters/backend/profiles/useProfilesPresenter';
import Image from 'next/image';

interface ProfilesViewProps {
  viewModel: ProfilesViewModel;
}

export function ProfilesView({ viewModel }: ProfilesViewProps) {
  const [state, actions] = useProfilesPresenter();
  const { profilesData } = viewModel;

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getVerificationText = (status: string) => {
    switch (status) {
      case 'verified': return 'ยืนยันแล้ว';
      case 'pending': return 'รอตรวจสอบ';
      case 'rejected': return 'ถูกปฏิเสธ';
      default: return 'ไม่ระบุ';
    }
  };

  const getGenderText = (gender?: string) => {
    switch (gender) {
      case 'male': return 'ชาย';
      case 'female': return 'หญิง';
      case 'other': return 'อื่นๆ';
      default: return 'ไม่ระบุ';
    }
  };

  const handleVerificationUpdate = async (id: string, status: 'pending' | 'verified' | 'rejected') => {
    const success = await actions.updateVerificationStatus(id, status);
    if (success) {
      window.location.reload();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะ${currentStatus ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}โปรไฟล์นี้?`)) {
      const success = await actions.toggleProfileStatus(id, !currentStatus);
      if (success) {
        window.location.reload();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบโปรไฟล์นี้? การกระทำนี้ไม่สามารถยกเลิกได้')) {
      const success = await actions.deleteProfile(id);
      if (success) {
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold backend-text">จัดการโปรไฟล์</h1>
          <p className="backend-text-muted mt-2">จัดการข้อมูลโปรไฟล์ผู้ใช้และการตรวจสอบยืนยันตัวตน</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            ส่งออกข้อมูล
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            รายงานการตรวจสอบ
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">โปรไฟล์ทั้งหมด</h3>
          <p className="text-2xl font-bold backend-text mt-2">{profilesData.stats.totalProfiles}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">ยืนยันตัวตนแล้ว</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{profilesData.stats.verifiedProfiles}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">รอตรวจสอบ</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{profilesData.stats.pendingVerification}</p>
        </div>
        <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
          <h3 className="backend-text-muted text-sm font-medium">ใช้งานวันนี้</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{profilesData.stats.activeProfilesToday}</p>
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <h3 className="text-lg font-semibold backend-text mb-4">การกระจายตามเพศ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{profilesData.stats.profilesByGender.male}</p>
            <p className="backend-text-muted text-sm">ชาย</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">{profilesData.stats.profilesByGender.female}</p>
            <p className="backend-text-muted text-sm">หญิง</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{profilesData.stats.profilesByGender.other}</p>
            <p className="backend-text-muted text-sm">อื่นๆ</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">{profilesData.stats.profilesByGender.notSpecified}</p>
            <p className="backend-text-muted text-sm">ไม่ระบุ</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="backend-sidebar-bg rounded-lg p-6 backend-sidebar-border border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อ, เบอร์โทร หรืออีเมล..."
              value={state.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
            />
          </div>
          <select
            value={state.verificationFilter}
            onChange={(e) => actions.setVerificationFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกสถานะการตรวจสอบ</option>
            <option value="verified">ยืนยันแล้ว</option>
            <option value="pending">รอตรวจสอบ</option>
            <option value="rejected">ถูกปฏิเสธ</option>
          </select>
          <select
            value={state.genderFilter}
            onChange={(e) => actions.setGenderFilter(e.target.value)}
            className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text"
          >
            <option value="">ทุกเพศ</option>
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
            <option value="other">อื่นๆ</option>
          </select>
          <select className="px-4 py-2 border backend-sidebar-border rounded-lg backend-sidebar-bg backend-text">
            <option value="">เรียงตาม</option>
            <option value="name">ชื่อ</option>
            <option value="created_at">วันที่สร้าง</option>
            <option value="last_login">เข้าใช้ล่าสุด</option>
            <option value="login_count">จำนวนการเข้าใช้</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Profiles Table */}
      <div className="backend-sidebar-bg rounded-lg backend-sidebar-border border">
        <div className="p-6">
          <h2 className="text-xl font-semibold backend-text mb-4">รายการโปรไฟล์</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b backend-sidebar-border">
                  <th className="text-left py-3 px-4 backend-text font-medium">ผู้ใช้</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">ติดต่อ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">เพศ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การเข้าใช้</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">สถานะการตรวจสอบ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">สถานะ</th>
                  <th className="text-left py-3 px-4 backend-text font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {profilesData.profiles.map((profile) => (
                  <tr key={profile.id} className="border-b backend-sidebar-border hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        {profile.avatarUrl && (
                          <Image
                            src={profile.avatarUrl}
                            alt={profile.fullName}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="backend-text font-medium">{profile.fullName}</div>
                          {profile.bio && (
                            <div className="backend-text-muted text-sm truncate max-w-xs">{profile.bio}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="backend-text-muted text-sm">{profile.phone}</div>
                        <div className="backend-text-muted text-sm">{profile.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 backend-text">{getGenderText(profile.gender)}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="backend-text text-sm font-medium">{profile.loginCount} ครั้ง</div>
                        <div className="backend-text-muted text-sm">
                          {profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString('th-TH') : 'ไม่เคยเข้าใช้'}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getVerificationColor(profile.verificationStatus)}`}>
                        {getVerificationText(profile.verificationStatus)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${profile.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                        {profile.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">ดูรายละเอียด</button>
                        <button className="text-green-600 hover:text-green-800 text-sm">แก้ไข</button>

                        {/* Verification Actions */}
                        {profile.verificationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleVerificationUpdate(profile.id, 'verified')}
                              disabled={state.isLoading}
                              className="text-green-600 hover:text-green-800 text-sm disabled:opacity-50"
                            >
                              อนุมัติ
                            </button>
                            <button
                              onClick={() => handleVerificationUpdate(profile.id, 'rejected')}
                              disabled={state.isLoading}
                              className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                            >
                              ปฏิเสธ
                            </button>
                          </>
                        )}

                        {/* Status Toggle */}
                        <button
                          onClick={() => handleToggleStatus(profile.id, profile.isActive)}
                          disabled={state.isLoading}
                          className={`text-sm disabled:opacity-50 ${profile.isActive
                            ? 'text-red-600 hover:text-red-800'
                            : 'text-green-600 hover:text-green-800'
                            }`}
                        >
                          {profile.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                        </button>

                        <button
                          onClick={() => handleDelete(profile.id)}
                          disabled={state.isLoading}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
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
          แสดง 1-{profilesData.profiles.length} จาก {profilesData.totalCount} รายการ
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
