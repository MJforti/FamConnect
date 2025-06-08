
export interface User {
  id: string;
  email: string;
  fullName: string;
  familyRole: 'admin' | 'member';
  createdAt: Date;
}

export interface FamilyRelationship {
  familyId: string;
  relationshipType: 'parent' | 'child' | 'sibling' | 'extended' | 'other';
  description?: string;
  createdAt: Date;
}

export interface Family {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  members: FamilyMember[];
  relatedFamilies: FamilyRelationship[];
  isPublic: boolean;
  coverImage?: string;
}

export interface FamilyMember {
  id: string;
  fullName: string;
  dateOfBirth: Date;
  relation: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  };
  notes: string;
  photoUrl?: string;
  relationships: Relationship[];
  familyId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPrimaryContact?: boolean;
  isDeceased?: boolean;
  customFields?: Record<string, any>; // For any additional custom fields
}

export interface Relationship {
  memberId: string;
  relationType: 'parent' | 'child' | 'sibling' | 'spouse' | 'grandparent' | 'grandchild' | 'uncle' | 'aunt' | 'cousin' | 'other';
  description?: string;
  familyId?: string; // Optional field to support cross-family relationships
}

export interface FamilyRelationship {
  familyId: string;
  relationshipType: 'parent' | 'child' | 'sibling' | 'extended' | 'other';
  description?: string;
  createdAt: Date;
}

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  familyId: string;
  uploadedBy: string;
  createdAt: Date;
  tags: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
}
