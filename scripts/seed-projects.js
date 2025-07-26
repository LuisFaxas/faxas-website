const admin = require('firebase-admin');
const path = require('path');

// Initialize admin SDK with service account
const serviceAccountPath = path.join(__dirname, '..', 'service-account-key.json');

try {
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
} catch (error) {
  console.error('Error loading service account key:', error.message);
  console.log('Please ensure service-account-key.json exists in the project root');
  process.exit(1);
}

const db = admin.firestore();

// Sample projects data
const projects = [
  {
    title: 'E-Commerce Dashboard',
    slug: 'ecommerce-dashboard',
    category: 'Web Application',
    description: 'Real-time inventory management with instant updates',
    longDescription: 'A modern e-commerce dashboard built with React and Firebase, featuring real-time inventory tracking, order management, and analytics. This platform helped increase sales by 271% for our client by providing instant updates and a seamless user experience.',
    techStack: ['React', 'Firebase', 'Tailwind CSS', 'TypeScript'],
    features: [
      'Real-time inventory updates without page refresh',
      'Order tracking and management dashboard',
      'Customer analytics with actionable insights',
      'Mobile-responsive design for on-the-go management',
      'Automated low-stock alerts',
      'Integration with payment gateways'
    ],
    demoUrl: '/demos/ecommerce',
    liveUrl: 'https://demo.faxas.net/ecommerce',
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop'
    ],
    status: 'completed',
    featured: true,
    metrics: { 
      desktop: 98, 
      mobile: 95,
      loadTime: 0.6,
      improvement: 271
    },
    testimonial: {
      client: 'Sarah Chen',
      role: 'CEO, TechStyle Boutique',
      content: 'The dashboard transformed how we manage inventory. Real-time updates saved us hours daily and increased our sales by 271%!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'
    },
    results: {
      before: '$2,400/mo',
      after: '$8,900/mo',
      metrics: {
        pageSpeed: { before: 4.2, after: 0.8, unit: 's' },
        bounceRate: { before: 68, after: 23, unit: '%' },
        conversion: { before: 1.3, after: 4.8, unit: '%' }
      }
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 1
  },
  {
    title: 'Booking Platform',
    slug: 'booking-platform',
    category: 'SaaS Platform',
    description: 'Seamless appointment scheduling with calendar integration',
    longDescription: 'A comprehensive booking system with calendar integration, automated reminders, and payment processing. This platform increased bookings by 292% for fitness businesses by making scheduling instant and effortless.',
    techStack: ['Next.js', 'PostgreSQL', 'Stripe API', 'Node.js', 'Redis'],
    features: [
      'Google Calendar & Outlook synchronization',
      'Automated SMS and email reminders',
      'Integrated payment processing with Stripe',
      'Multi-timezone support for global clients',
      'Recurring appointment management',
      'Staff availability tracking',
      'Customer self-service portal'
    ],
    demoUrl: '/demos/booking',
    videoUrl: 'https://storage.googleapis.com/faxas-demos/booking-demo.mp4',
    images: [
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1200&h=800&fit=crop'
    ],
    status: 'completed',
    featured: true,
    metrics: { 
      desktop: 96, 
      mobile: 94,
      loadTime: 0.8,
      improvement: 292
    },
    testimonial: {
      client: 'Mike Rodriguez',
      role: 'Owner, FitLife Gym',
      content: 'The booking system is instant. Members love it! We went from 12 to 47 signups per week.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
    },
    results: {
      before: '12 signups/week',
      after: '47 signups/week',
      metrics: {
        pageSpeed: { before: 5.1, after: 0.9, unit: 's' },
        mobileUsage: { before: 45, after: 78, unit: '%' },
        retention: { before: 60, after: 85, unit: '%' }
      }
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 2
  },
  {
    title: 'Analytics Dashboard',
    slug: 'analytics-dashboard',
    category: 'Data Visualization',
    description: 'Interactive data visualization with real-time updates',
    longDescription: 'A powerful analytics platform with customizable dashboards, real-time data streaming, and advanced visualization options. This solution helped B2B companies increase conversion rates by 267% through better data insights.',
    techStack: ['React', 'D3.js', 'WebSockets', 'Python', 'TensorFlow'],
    features: [
      'Real-time data streaming via WebSockets',
      'Custom chart builders with D3.js',
      'PDF and Excel export functionality',
      'Team collaboration with shared dashboards',
      'Predictive analytics with ML models',
      'API integration hub',
      'White-label customization options'
    ],
    demoUrl: '/demos/analytics',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop'
    ],
    status: 'completed',
    metrics: { 
      desktop: 97, 
      mobile: 93,
      loadTime: 0.7,
      improvement: 267
    },
    testimonial: {
      client: 'David Park',
      role: 'CTO, Tech Solutions Inc',
      content: 'Our demos load instantly. Game changer for sales. Conversion went from 3% to 11%!',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
    },
    results: {
      before: '3% conversion',
      after: '11% conversion',
      metrics: {
        pageSpeed: { before: 6.3, after: 0.7, unit: 's' },
        demoCompletion: { before: 32, after: 89, unit: '%' },
        leadQuality: { before: 'Low', after: 'High', unit: '' }
      }
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 3
  },
  {
    title: 'Restaurant Ordering System',
    slug: 'restaurant-ordering',
    category: 'E-Commerce',
    description: 'Online ordering with real-time kitchen updates',
    longDescription: 'A complete restaurant management system with online ordering, real-time kitchen display, and delivery tracking. Increased order volume by 340% during pandemic.',
    techStack: ['Vue.js', 'Firebase', 'Twilio', 'Google Maps API'],
    features: [
      'Real-time order tracking',
      'Kitchen display system',
      'Delivery driver tracking',
      'SMS order notifications',
      'Menu management system',
      'Analytics dashboard'
    ],
    demoUrl: '/demos/restaurant',
    images: [
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&h=800&fit=crop'
    ],
    status: 'completed',
    featured: false,
    metrics: { 
      desktop: 95, 
      mobile: 97,
      loadTime: 0.9,
      improvement: 340
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 4
  },
  {
    title: 'Learning Management System',
    slug: 'lms-platform',
    category: 'EdTech',
    description: 'Interactive course platform with progress tracking',
    longDescription: 'A modern LMS with video streaming, interactive quizzes, and detailed progress analytics. Improved course completion rates by 65%.',
    techStack: ['Next.js', 'AWS', 'Stripe', 'PostgreSQL'],
    features: [
      'Video streaming with adaptive bitrate',
      'Interactive quizzes and assignments',
      'Progress tracking and certificates',
      'Discussion forums',
      'Payment integration',
      'Mobile app support'
    ],
    demoUrl: '/demos/lms',
    images: [
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=800&fit=crop'
    ],
    status: 'completed',
    metrics: { 
      desktop: 94, 
      mobile: 92,
      loadTime: 1.1,
      improvement: 65
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    order: 5
  }
];

async function seedProjects() {
  console.log('🌱 Starting to seed projects...\n');

  const batch = db.batch();
  
  for (const project of projects) {
    const projectRef = db.collection('projects').doc();
    batch.set(projectRef, {
      ...project,
      id: projectRef.id
    });
    console.log(`✅ Added project: ${project.title}`);
  }

  try {
    await batch.commit();
    console.log('\n✨ Successfully seeded all projects to Firestore!');
    console.log(`📊 Total projects added: ${projects.length}`);
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
  }

  process.exit(0);
}

// Run the seed function
seedProjects();