export interface Complaint {
  id: number;
  category: string;
  tone: string;
  keywords: string[];
  priority?: 'high' | 'medium';
  has_typos?: boolean;
  thread: ThreadMessage[];
  extracted_data: ExtractedData;
}

export interface ThreadMessage {
  role: 'customer' | 'bk';
  message: string;
  type?: 'final';
  animation?: boolean;
  attachment?: boolean;
}

export interface ExtractedData {
  location?: string;
  city?: string;
  state?: string;
  issue?: string;
  time?: string;
  order_details?: string;
  employee_description?: string;
  employee_name?: string;
  manager_name?: string;
  resolution_requested?: string;
  health_concern?: boolean;
  discrimination_complaint?: boolean;
  slurs_used?: string;
  threats_made?: string;
  previous_attempts?: string;
  evidence?: string;
  specific_food_item?: string;
  app_issue?: string;
  payment_problem?: string;
  delivery_issue?: string;
  refund_status?: string;
  frequency?: string;
  priority?: string;
  status?: string;
}

export interface GeneratedCustomer {
  name: string;
  phone: string;
  state: string;
  stateAbbr: string;
  city: string;
  avatar?: string;
}

export interface AngerLevel {
  level: number;
  category: 'furious' | 'angry' | 'annoyed' | 'calm';
  color: string;
  emoji: string;
  label: string;
}

export interface LocationData {
  street?: string;
  city: string;
  state: string;
  stateAbbr: string;
  raw: string;
}

export interface ComplaintWithMetadata extends Complaint {
  customer: GeneratedCustomer;
  location: LocationData;
  anger: AngerLevel;
  timestamp: Date;
}

export type SortOption = 'recent' | 'oldest' | 'most-angry' | 'category';

export type FilterCategory = 'all' | 'fries' | 'burgers' | 'wrong-orders' | 'wait-times' |
  'customer-service' | 'cleanliness' | 'app-tech' | 'miscellaneous';

export type FilterAnger = 'all' | 'furious' | 'angry' | 'annoyed' | 'calm';
