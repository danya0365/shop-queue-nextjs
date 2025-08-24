'use client';

import { ProfileDto } from '@/src/application/dtos/profile-dto';

interface ProfileCardProps {
  profile: ProfileDto;
  isActive: boolean;
  onSwitch: (profileId: string) => void;
  onEdit: (profile: ProfileDto) => void;
  onDelete: (profileId: string) => void;
}

export function ProfileCard({ 
  profile, 
  isActive, 
  onSwitch, 
  onEdit, 
  onDelete 
}: ProfileCardProps) {
  return (
    <div className={`
      bg-surface rounded-lg border-2 p-6 transition-all duration-200
      ${isActive 
        ? 'border-primary shadow-lg ring-2 ring-primary-light' 
        : 'border-border hover:border-border-dark hover:shadow-md'
      }
    `}>
      {/* Profile Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center text-white text-xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          
          {/* Profile Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {profile.name}
              {isActive && (
                <span className="bg-success-light text-success-dark text-xs px-2 py-1 rounded-full">
                  ใช้งานอยู่
                </span>
              )}
            </h3>
            <p className="text-muted">@{profile.username}</p>
            {profile.bio && (
              <p className="text-muted text-sm mt-1">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Role Badge */}
        <span className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${profile.role === 'admin' 
            ? 'bg-error-light text-error-dark' 
            : profile.role === 'moderator'
            ? 'bg-warning-light text-warning-dark'
            : 'bg-muted-light text-muted-dark'
          }
        `}>
          {profile.role === 'admin' ? 'ผู้ดูแลระบบ' : 
           profile.role === 'moderator' ? 'ผู้ดูแล' : 'ผู้ใช้งาน'}
        </span>
      </div>

      {/* Profile Actions */}
      <div className="flex gap-2">
        {!isActive && (
          <button
            onClick={() => onSwitch(profile.id)}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            เปลี่ยนเป็นโปรไฟล์หลัก
          </button>
        )}
        
        <button
          onClick={() => onEdit(profile)}
          className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted-light transition-colors text-sm font-medium"
        >
          แก้ไข
        </button>
        
        {!isActive && (
          <button
            onClick={() => onDelete(profile.id)}
            className="px-4 py-2 border border-error text-error rounded-lg hover:bg-error-light transition-colors text-sm font-medium"
          >
            ลบ
          </button>
        )}
      </div>

      {/* Profile Details */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted">สร้างเมื่อ:</span>
            <p className="text-foreground">
              {new Date(profile.createdAt).toLocaleDateString('th-TH')}
            </p>
          </div>
          <div>
            <span className="text-muted">อัปเดตล่าสุด:</span>
            <p className="text-foreground">
              {new Date(profile.updatedAt).toLocaleDateString('th-TH')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
