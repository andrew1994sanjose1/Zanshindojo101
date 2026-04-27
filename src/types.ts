export type UserRole = 'visitor' | 'member' | 'instructor' | 'staff' | 'admin';

export interface DojoUser {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  bio?: string;
  rank?: string;
  joinedAt?: string;
}

export interface DojoTrial {
  id?: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface DojoClass {
  id?: string;
  title: string;
  instructorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface Tutorial {
  id?: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  level: string;
  xpReward: number;
}

export interface UserProgress {
  userId: string;
  completedTutorials: string[];
  totalXP: number;
}
