import { LeadScoreBreakdown } from '@/types/portal';
import { questions } from './questionnaire-config';

export function calculateLeadScore(responses: Map<string, any>): LeadScoreBreakdown {
  let budgetScore = 0;
  let timelineScore = 0;
  let authorityScore = 0;
  let complexityScore = 0;
  let engagementScore = 0;

  // Budget Component (35% - 0-35 points)
  const budgetResponse = responses.get('budget');
  if (budgetResponse) {
    const budgetMap: Record<string, number> = {
      'under_5k': 5,
      '5k_10k': 15,
      '10k_25k': 25,
      '25k_50k': 30,
      '50k_plus': 35,
    };
    budgetScore = budgetMap[budgetResponse] || 0;
  }

  // Timeline Component (25% - 0-25 points)
  const timelineResponse = responses.get('timeline');
  if (timelineResponse) {
    const timelineMap: Record<string, number> = {
      'asap': 25,
      '1_month': 22,
      '2_3_months': 18,
      '3_6_months': 12,
      'flexible': 5,
    };
    timelineScore = timelineMap[timelineResponse] || 0;
  }

  // Authority Component (15% - 0-15 points)
  const authorityResponse = responses.get('decision_maker');
  if (authorityResponse) {
    const authorityMap: Record<string, number> = {
      'sole_decision': 15,
      'key_influencer': 10,
      'team_member': 5,
      'researching': 2,
    };
    authorityScore = authorityMap[authorityResponse] || 0;
  }

  // Complexity Component (15% - 0-15 points)
  const projectType = responses.get('project_type');
  const features = responses.get('features') || [];
  
  if (projectType) {
    const complexityMap: Record<string, number> = {
      'new_website': 5,
      'redesign': 5,
      'web_app': 10,
      'ecommerce': 8,
    };
    complexityScore = complexityMap[projectType] || 0;
  }

  // Add points for feature complexity
  if (features.length > 5) {
    complexityScore = Math.min(15, complexityScore + 5);
  } else if (features.length > 3) {
    complexityScore = Math.min(15, complexityScore + 3);
  }

  // Engagement Component (10% - 0-10 points)
  let answeredQuestions = 0;
  let detailedAnswers = 0;

  // Count answered questions
  questions.forEach(question => {
    if (responses.has(question.id)) {
      answeredQuestions++;
      
      // Check for detailed text answers
      if (question.type === 'textarea') {
        const answer = responses.get(question.id);
        if (answer && answer.length > 50) {
          detailedAnswers++;
        }
      }
    }
  });

  // Calculate engagement score
  const completionRate = answeredQuestions / questions.length;
  engagementScore = Math.round(completionRate * 7); // 0-7 points for completion

  // Add bonus for detailed answers
  if (detailedAnswers >= 2) {
    engagementScore += 3;
  } else if (detailedAnswers >= 1) {
    engagementScore += 1;
  }

  engagementScore = Math.min(10, engagementScore);

  // Calculate total
  const total = budgetScore + timelineScore + authorityScore + complexityScore + engagementScore;

  // Determine temperature
  let temperature: LeadScoreBreakdown['temperature'];
  if (total >= 80) {
    temperature = 'hot';
  } else if (total >= 60) {
    temperature = 'warm';
  } else if (total >= 40) {
    temperature = 'qualified';
  } else if (total >= 20) {
    temperature = 'cool';
  } else {
    temperature = 'early';
  }

  return {
    budget: budgetScore,
    timeline: timelineScore,
    authority: authorityScore,
    complexity: complexityScore,
    engagement: engagementScore,
    total,
    temperature,
  };
}

// Get score interpretation
export function getScoreInterpretation(score: LeadScoreBreakdown): {
  title: string;
  description: string;
  nextSteps: string[];
  priority: 'immediate' | 'high' | 'medium' | 'low';
} {
  switch (score.temperature) {
    case 'hot':
      return {
        title: "You're a perfect fit!",
        description: "Your project aligns perfectly with our expertise and your timeline is urgent. Let's talk immediately.",
        nextSteps: [
          "Schedule a call within 24 hours",
          "Prepare a custom proposal",
          "Fast-track your project"
        ],
        priority: 'immediate'
      };

    case 'warm':
      return {
        title: "Great potential match!",
        description: "Your project looks very promising and we'd love to explore how we can help.",
        nextSteps: [
          "Schedule a discovery call this week",
          "Review similar case studies",
          "Discuss project approach"
        ],
        priority: 'high'
      };

    case 'qualified':
      return {
        title: "Let's explore possibilities",
        description: "Your project has good potential. Let's discuss how to make it work within your constraints.",
        nextSteps: [
          "Review educational resources",
          "Consider project phasing options",
          "Schedule a consultation"
        ],
        priority: 'medium'
      };

    case 'cool':
      return {
        title: "Building foundation",
        description: "While we may not be the perfect fit right now, here are resources to help you plan.",
        nextSteps: [
          "Access planning templates",
          "Read our project guides",
          "Join our newsletter for tips"
        ],
        priority: 'low'
      };

    case 'early':
    default:
      return {
        title: "Just getting started",
        description: "You're in the early stages of planning. We're here with resources when you're ready.",
        nextSteps: [
          "Download our planning guide",
          "Explore case studies",
          "Subscribe for web development tips"
        ],
        priority: 'low'
      };
  }
}

// Calculate follow-up timing based on score
export function getFollowUpTiming(score: LeadScoreBreakdown): {
  initial: string;
  reminder: string;
  method: 'call' | 'email';
} {
  switch (score.temperature) {
    case 'hot':
      return {
        initial: 'Within 2 hours',
        reminder: '24 hours',
        method: 'call'
      };

    case 'warm':
      return {
        initial: 'Within 24 hours',
        reminder: '3 days',
        method: 'call'
      };

    case 'qualified':
      return {
        initial: 'Within 48 hours',
        reminder: '1 week',
        method: 'email'
      };

    case 'cool':
    case 'early':
    default:
      return {
        initial: 'Within 1 week',
        reminder: '1 month',
        method: 'email'
      };
  }
}