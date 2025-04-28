export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  type: 'one-time' | 'subscription';
  interval?: 'month' | 'year';
}

export const pricingPlans: Record<string, PricingPlan> = {
  // One-time payment plans
  compress: {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    price: 1.99,
    type: 'one-time',
    features: [
      'Compress up to 10MB PDFs',
      'Maintain PDF quality',
      'Instant download'
    ]
  },
  merge: {
    id: 'merge',
    name: 'Merge PDFs',
    description: 'Combine multiple PDFs into one',
    price: 1.99,
    type: 'one-time',
    features: [
      'Merge up to 5 PDFs',
      'Preserve original quality',
      'Instant download'
    ]
  },
  split: {
    id: 'split',
    name: 'Split PDF',
    description: 'Split PDF into multiple files',
    price: 1.99,
    type: 'one-time',
    features: [
      'Split by page numbers',
      'Download as ZIP',
      'Instant processing'
    ]
  },
  protect: {
    id: 'protect',
    name: 'Protect PDF',
    description: 'Add password protection',
    price: 0.99,
    type: 'one-time',
    features: [
      'Strong password protection',
      'Preserve original quality',
      'Instant download'
    ]
  },
  // Subscription plans
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    description: 'Unlimited access to all PDF tools',
    price: 1.99,
    type: 'subscription',
    interval: 'month',
    features: [
      'Unlimited PDF processing',
      'All tools included',
      'Priority support',
      'No file size limits',
      'Batch processing'
    ]
  },
  pro_yearly: {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    description: 'Unlimited access to all PDF tools',
    price: 1.99,
    type: 'subscription',
    interval: 'year',
    features: [
      'Unlimited PDF processing',
      'All tools included',
      'Priority support',
      'No file size limits',
      'Batch processing',
      'Save 50% compared to monthly'
    ]
  }
};

export const pricing = {
  pdfTools: {
    compress: {
      name: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
    },
    merge: {
      name: 'Merge PDFs',
      description: 'Combine multiple PDFs into one document',
    },
    split: {
      name: 'Split PDF',
      description: 'Split PDF into multiple documents',
    },
    password: {
      name: 'Password Protection',
      description: 'Add password protection to your PDF',
    },
  },
  donations: {
    small: {
      name: 'Small Support',
      amount: 1.99,
      description: 'Support our service with a small donation',
    },
    medium: {
      name: 'Medium Support',
      amount: 4.99,
      description: 'Support our service with a medium donation',
    },
    large: {
      name: 'Large Support',
      amount: 9.99,
      description: 'Support our service with a large donation',
    },
  },
} as const; 