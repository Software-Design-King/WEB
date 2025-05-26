import { ReactNode } from 'react';

export interface FeedbackFormData {
  scoreFeed: string;
  behaviorFeed: string;
  attendanceFeed: string;
  attitudeFeed: string;
  OthersFeed: string;
  isSharedWithStudent: boolean;
  isSharedWithParent: boolean;
}

export type FeedbackType = 'scoreFeed' | 'behaviorFeed' | 'attendanceFeed' | 'attitudeFeed' | 'OthersFeed';

export interface FeedbackTypeOption {
  value: FeedbackType;
  label: string;
  icon: ReactNode;
  color: string;
}
