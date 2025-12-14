export enum AppStep {
  INTRO = 'INTRO',
  FORM = 'FORM',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  UNLOCK = 'UNLOCK'
}

export enum DesignStyle {
  MODERN = 'Hiện đại',
  MINIMALIST = 'Tối giản',
  NEOCLASSICAL = 'Tân cổ điển',
  LUXURY = 'Luxury',
  JAPANDI = 'Japandi'
}

export enum BudgetRange {
  LOW = 'Dưới 100 triệu',
  MEDIUM = '100 - 300 triệu',
  HIGH = 'Trên 300 triệu'
}

export enum RoomType {
  LIVING_ROOM = 'Phòng khách',
  KITCHEN = 'Phòng bếp',
  BEDROOM = 'Phòng ngủ',
  OFFICE = 'Phòng làm việc',
  OTHER = 'Khác'
}

export interface UserFormData {
  name: string;
  phone: string;
  email: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  roomType: RoomType;
  style: DesignStyle;
  budget: BudgetRange;
  note: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
}

export interface DesignOption {
  type: 'FUNCTIONAL' | 'AESTHETIC' | 'PREMIUM';
  title: string;
  description: string;
  estimatedCost: string;
  keyFeatures: string[];
  imageUrl?: string | null;
}

export interface AIAnalysisResult {
  currentSpaceAnalysis: string;
  options: DesignOption[];
}
