export interface OpeningHour {
  id: string;
  shopId: string;
  dayOfWeek: string; // 'monday', 'tuesday', etc.
  isOpen: boolean;
  openTime: string | null; // HH:mm format
  closeTime: string | null; // HH:mm format
  breakStart: string | null; // HH:mm format
  breakEnd: string | null; // HH:mm format
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOpeningHourData {
  dayOfWeek: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface UpdateOpeningHourData {
  isOpen?: boolean;
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
}