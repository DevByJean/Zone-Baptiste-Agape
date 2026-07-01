export interface Database {
  public: {
    Tables: {
      members: { Row: Member; Insert: MemberInsert; Update: Partial<MemberInsert> };
      activities: { Row: Activity; Insert: ActivityInsert; Update: Partial<ActivityInsert> };
      news: { Row: News; Insert: NewsInsert; Update: Partial<NewsInsert> };
      gallery: { Row: GalleryItem; Insert: GalleryInsert; Update: Partial<GalleryInsert> };
      contacts: { Row: Contact; Insert: ContactInsert; Update: Partial<ContactInsert> };
      subscribers: { Row: Subscriber; Insert: SubscriberInsert; Update: Partial<SubscriberInsert> };
      registrations: { Row: Registration; Insert: RegistrationInsert; Update: Partial<RegistrationInsert> };
      donations: { Row: Donation; Insert: DonationInsert; Update: Partial<DonationInsert> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Department = 'Tous' | 'Hommes' | 'Femmes' | 'Jeunesse' | 'Enfants';
export type Organization = 'CBT' | 'Zone';
export type Organizer = 'Zone' | 'Église';

export interface Member {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  bio: string | null;
  organization: Organization;
  display_order: number;
  created_at: string;
}
export type MemberInsert = Omit<Member, 'id' | 'created_at'>;

export interface Activity {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  event_date: string | null;
  location: string | null;
  department: Department;
  organizer: Organizer;
  created_at: string;
}
export type ActivityInsert = Omit<Activity, 'id' | 'created_at'>;

export interface News {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  published_at: string;
  created_at: string;
}
export type NewsInsert = Omit<News, 'id' | 'created_at'>;

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  department: Department | null;
  created_at: string;
}
export type GalleryInsert = Omit<GalleryItem, 'id' | 'created_at'>;

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}
export type ContactInsert = Omit<Contact, 'id' | 'is_read' | 'created_at'>;

export interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}
export type SubscriberInsert = Pick<Subscriber, 'email'>;

export interface Registration {
  id: string;
  activity_id: string;
  name: string;
  email: string;
  phone: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}
export type RegistrationInsert = Omit<Registration, 'id' | 'status' | 'created_at'>;

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  payment_method: 'PayPal' | 'Mixx' | 'Moov';
  donor_name: string | null;
  donor_email: string | null;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}
export type DonationInsert = Omit<Donation, 'id' | 'status' | 'created_at'>;
