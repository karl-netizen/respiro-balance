

import { Helmet } from 'react-helmet';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Target, Sparkles } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Respiro Balance</title>
        <meta name="description" content="Learn about Respiro Balance - your daily companion for mindfulness, meditation, and work-life balance." />
      </Helmet>
      
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container max-w-6xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About Respiro Balance
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your daily companion for mindfulness, meditation, and achieving perfect work-life balance through technology and wisdom.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  To empower individuals and organizations with accessible, science-backed mindfulness tools that seamlessly integrate into modern life. We believe that mental wellness should be as prioritized as physical health.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  A world where mindfulness and mental wellness are integrated into everyday routines, helping people achieve balance, reduce stress, and live more fulfilling lives through technology and community.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <CardTitle>Compassion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    We approach wellness with kindness and understanding, creating a safe space for growth and healing.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    We believe in the power of connection and support, fostering a community of mindful individuals.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <CardTitle>Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    We continuously evolve our platform using the latest research and technology to serve you better.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">What We Offer</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Guided Meditation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Expert-led meditation sessions for all experience levels, from beginners to advanced practitioners.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Breathing Exercises</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Science-backed breathing techniques to reduce stress and improve focus throughout your day.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Morning Rituals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Customizable morning routines to start your day with intention and mindfulness.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Focus Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Productivity tools and timers to help you maintain focus and achieve your goals.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Comprehensive analytics to track your wellness journey and celebrate achievements.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Biofeedback Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Connect wearable devices to get real-time insights into your stress and wellness levels.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Our Partners</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">KGP Coaching & Consulting</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Professional coaching services and organizational wellness programs.
                  </p>
                  <a 
                    href="https://kgpcoaching.com.au/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Visit KGP Coaching →
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">LearnRelaxation</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Educational resources and training for relaxation and stress management techniques.
                  </p>
                  <a 
                    href="https://learnrelaxation.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Visit LearnRelaxation →
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      
    </>
  );
};

export default AboutPage;
