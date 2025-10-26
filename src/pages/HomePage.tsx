

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Users, Zap, Play, CheckCircle } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Brain,
      title: 'Guided Meditation',
      description: 'Expert-led sessions for stress relief, focus, and mindfulness'
    },
    {
      icon: Heart,
      title: 'Biofeedback Integration',
      description: 'Real-time heart rate and stress monitoring during sessions'
    },
    {
      icon: Zap,
      title: 'Focus Mode',
      description: 'Pomodoro-style focus sessions with mindfulness breaks'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with others on their mindfulness journey'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      quote: 'Respiro Balance has transformed my daily routine. I feel more centered and productive.'
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      quote: 'The biofeedback feature helps me understand my stress patterns like never before.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            ✨ New: AI-Powered Personalization
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="block text-respiro-dark">Meditation Balance</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your daily routine with guided meditation, biofeedback monitoring, 
            and a supportive community. Start your mindfulness journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">
                <Play className="mr-2 h-5 w-5" />
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/meditation">
                Explore Sessions
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Mindful Living
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and features designed to support your meditation practice and overall well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-respiro-dark mx-auto mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Respiro Balance?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Proven Benefits
              </h3>
              <ul className="space-y-4">
                {[
                  'Reduce stress and anxiety by up to 60%',
                  'Improve focus and concentration',
                  'Better sleep quality and duration',
                  'Enhanced emotional regulation',
                  'Increased mindfulness and self-awareness'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                What Our Users Say
              </h3>
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <blockquote className="text-gray-700 mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-respiro-dark py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-respiro-light mb-8">
            Join thousands of users who have discovered inner peace and improved well-being.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">
              Start Your Journey Today
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
