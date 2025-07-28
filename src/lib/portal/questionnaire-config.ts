import { Question } from '@/types/portal';

export const questionnaireVersion = '1.0.0';

export const questions: Question[] = [
  // 1. Welcome & Project Type
  {
    id: 'project_type',
    type: 'card-select',
    title: 'What type of project are you looking to build?',
    description: 'This helps us understand the scope and technical requirements.',
    required: true,
    options: [
      {
        value: 'new_website',
        label: 'New Website',
        description: 'Build a brand new website from scratch',
        metadata: { complexity: 'medium', scoreWeight: 10 }
      },
      {
        value: 'redesign',
        label: 'Website Redesign',
        description: 'Refresh and modernize an existing website',
        metadata: { complexity: 'medium', scoreWeight: 8 }
      },
      {
        value: 'web_app',
        label: 'Web Application',
        description: 'Build a complex, interactive web application',
        metadata: { complexity: 'high', scoreWeight: 15 }
      },
      {
        value: 'ecommerce',
        label: 'E-commerce',
        description: 'Online store with payment processing',
        metadata: { complexity: 'high', scoreWeight: 12 }
      },
    ],
    metadata: { scoreWeight: 0.15, category: 'project' }
  },

  // 2. Industry
  {
    id: 'industry',
    type: 'select',
    title: 'What industry is your business in?',
    description: 'This helps us tailor our approach to your sector.',
    required: true,
    options: [
      { value: 'technology', label: 'Technology / SaaS' },
      { value: 'healthcare', label: 'Healthcare / Medical' },
      { value: 'finance', label: 'Finance / Banking' },
      { value: 'retail', label: 'Retail / E-commerce' },
      { value: 'education', label: 'Education / E-learning' },
      { value: 'realestate', label: 'Real Estate' },
      { value: 'hospitality', label: 'Hospitality / Travel' },
      { value: 'nonprofit', label: 'Non-profit / NGO' },
      { value: 'other', label: 'Other' },
    ],
    metadata: { scoreWeight: 0.05, category: 'business' }
  },

  // 3. Key Features
  {
    id: 'features',
    type: 'multi-select',
    title: 'Which features are essential for your project?',
    description: 'Select all that apply.',
    required: true,
    options: [
      { value: 'cms', label: 'Content Management System' },
      { value: 'user_auth', label: 'User Authentication' },
      { value: 'payment', label: 'Payment Processing' },
      { value: 'api', label: 'API Integration' },
      { value: 'analytics', label: 'Analytics Dashboard' },
      { value: 'search', label: 'Advanced Search' },
      { value: 'mobile', label: 'Mobile App' },
      { value: 'multilingual', label: 'Multi-language Support' },
      { value: 'social', label: 'Social Media Integration' },
      { value: 'booking', label: 'Booking/Scheduling System' },
    ],
    metadata: { scoreWeight: 0.10, category: 'technical' }
  },

  // 4. Design Preferences
  {
    id: 'design_style',
    type: 'card-select',
    title: 'What design style resonates with your brand?',
    description: 'This helps us align with your visual preferences.',
    required: true,
    options: [
      {
        value: 'modern_minimal',
        label: 'Modern & Minimal',
        description: 'Clean, spacious, focus on content',
      },
      {
        value: 'bold_creative',
        label: 'Bold & Creative',
        description: 'Unique, artistic, stand out from the crowd',
      },
      {
        value: 'corporate_professional',
        label: 'Corporate & Professional',
        description: 'Trustworthy, established, traditional',
      },
      {
        value: 'playful_friendly',
        label: 'Playful & Friendly',
        description: 'Approachable, fun, engaging',
      },
    ],
    metadata: { scoreWeight: 0.05, category: 'design' }
  },

  // 5. Timeline
  {
    id: 'timeline',
    type: 'card-select',
    title: 'When do you need this project completed?',
    description: 'Be realistic - quality takes time.',
    required: true,
    options: [
      {
        value: 'asap',
        label: 'ASAP',
        description: 'Need it yesterday (rush charges may apply)',
        metadata: { urgency: 'high', scoreBonus: 10 }
      },
      {
        value: '1_month',
        label: 'Within 1 month',
        description: 'Fast turnaround needed',
        metadata: { urgency: 'high', scoreBonus: 8 }
      },
      {
        value: '2_3_months',
        label: '2-3 months',
        description: 'Standard timeline for most projects',
        metadata: { urgency: 'medium', scoreBonus: 5 }
      },
      {
        value: '3_6_months',
        label: '3-6 months',
        description: 'Comfortable timeline for complex projects',
        metadata: { urgency: 'low', scoreBonus: 3 }
      },
      {
        value: 'flexible',
        label: 'Flexible',
        description: 'No hard deadline',
        metadata: { urgency: 'low', scoreBonus: 0 }
      },
    ],
    metadata: { scoreWeight: 0.25, category: 'timeline' }
  },

  // 6. Budget
  {
    id: 'budget',
    type: 'card-select',
    title: "What's your budget for this project?",
    description: 'This helps us recommend the best solution within your range.',
    required: true,
    options: [
      {
        value: 'under_5k',
        label: 'Under $5,000',
        description: 'Essential features only',
        metadata: { score: 5 }
      },
      {
        value: '5k_10k',
        label: '$5,000 - $10,000',
        description: 'Good for small business websites',
        metadata: { score: 15 }
      },
      {
        value: '10k_25k',
        label: '$10,000 - $25,000',
        description: 'Professional sites with custom features',
        metadata: { score: 25 }
      },
      {
        value: '25k_50k',
        label: '$25,000 - $50,000',
        description: 'Complex applications and platforms',
        metadata: { score: 30 }
      },
      {
        value: '50k_plus',
        label: '$50,000+',
        description: 'Enterprise-level solutions',
        metadata: { score: 35 }
      },
    ],
    metadata: { scoreWeight: 0.35, category: 'budget' }
  },

  // 7. Current Website
  {
    id: 'current_website',
    type: 'yes-no',
    title: 'Do you currently have a website?',
    description: 'This helps us understand your starting point.',
    required: true,
    branching: [
      {
        condition: { questionId: 'current_website', operator: 'equals', value: true },
        nextQuestionId: 'current_website_url'
      }
    ],
    metadata: { scoreWeight: 0.05, category: 'business' }
  },

  // 7a. Current Website URL (conditional)
  {
    id: 'current_website_url',
    type: 'text',
    title: "What's your current website URL?",
    description: 'This helps us review your existing presence.',
    placeholder: 'https://example.com',
    required: false,
    validation: {
      pattern: '^https?://.+',
      customMessage: 'Please enter a valid URL starting with http:// or https://'
    },
    metadata: { scoreWeight: 0, category: 'business' }
  },

  // 8. Decision Making
  {
    id: 'decision_maker',
    type: 'card-select',
    title: 'What is your role in this project?',
    description: 'This helps us understand the decision-making process.',
    required: true,
    options: [
      {
        value: 'sole_decision',
        label: "I'm the decision maker",
        description: 'I have full authority to approve this project',
        metadata: { authorityScore: 15 }
      },
      {
        value: 'key_influencer',
        label: 'Key influencer',
        description: 'I heavily influence the decision',
        metadata: { authorityScore: 10 }
      },
      {
        value: 'team_member',
        label: 'Team member',
        description: 'Part of the decision-making team',
        metadata: { authorityScore: 5 }
      },
      {
        value: 'researching',
        label: 'Just researching',
        description: 'Gathering information for others',
        metadata: { authorityScore: 2 }
      },
    ],
    metadata: { scoreWeight: 0.15, category: 'authority' }
  },

  // 9. Project Goals
  {
    id: 'project_goals',
    type: 'textarea',
    title: 'What are your main goals for this project?',
    description: 'Tell us what success looks like for you.',
    placeholder: 'Example: Increase online sales by 50%, improve user experience, establish professional brand presence...',
    required: true,
    validation: {
      min: 20,
      customMessage: 'Please provide at least 20 characters about your goals'
    },
    metadata: { scoreWeight: 0.10, category: 'engagement' }
  },

  // 10. Biggest Challenge
  {
    id: 'biggest_challenge',
    type: 'textarea',
    title: "What's your biggest challenge right now?",
    description: 'What problem are you trying to solve?',
    placeholder: 'Example: Our current website doesn\'t convert visitors, it\'s slow and outdated...',
    required: true,
    validation: {
      min: 20,
      customMessage: 'Please provide at least 20 characters about your challenges'
    },
    metadata: { scoreWeight: 0.05, category: 'engagement' }
  },

  // 11. Additional Context
  {
    id: 'additional_info',
    type: 'textarea',
    title: 'Anything else we should know?',
    description: 'Special requirements, inspirations, or questions for us.',
    placeholder: 'Optional: Share any additional context, links to sites you like, specific requirements...',
    required: false,
    metadata: { scoreWeight: 0.05, category: 'engagement' }
  }
];

// Get question by ID
export function getQuestionById(id: string): Question | undefined {
  return questions.find(q => q.id === id);
}

// Get next question based on current question and branching logic
export function getNextQuestion(currentQuestionId: string, responses: Map<string, any>): Question | null {
  const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
  const currentQuestion = questions[currentIndex];

  // Check branching rules
  if (currentQuestion?.branching) {
    for (const rule of currentQuestion.branching) {
      const responseValue = responses.get(rule.condition.questionId);
      
      switch (rule.condition.operator) {
        case 'equals':
          if (responseValue === rule.condition.value) {
            return getQuestionById(rule.nextQuestionId) || null;
          }
          break;
        case 'contains':
          if (Array.isArray(responseValue) && responseValue.includes(rule.condition.value)) {
            return getQuestionById(rule.nextQuestionId) || null;
          }
          break;
        case 'greater_than':
          if (responseValue > rule.condition.value) {
            return getQuestionById(rule.nextQuestionId) || null;
          }
          break;
        case 'less_than':
          if (responseValue < rule.condition.value) {
            return getQuestionById(rule.nextQuestionId) || null;
          }
          break;
      }
    }
  }

  // Return next question in sequence
  if (currentIndex < questions.length - 1) {
    return questions[currentIndex + 1];
  }

  return null;
}

// Get all questions that should be shown based on responses
export function getQuestionFlow(responses: Map<string, any>): Question[] {
  const flow: Question[] = [];
  let currentQuestion: Question | null = questions[0];

  while (currentQuestion) {
    flow.push(currentQuestion);
    
    if (responses.has(currentQuestion.id)) {
      currentQuestion = getNextQuestion(currentQuestion.id, responses);
    } else {
      break;
    }
  }

  return flow;
}