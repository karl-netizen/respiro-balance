
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Calendar, User, ArrowRight, Clock, Heart } from 'lucide-react';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 12 },
    { id: 'meditation', name: 'Meditation', count: 5 },
    { id: 'wellness', name: 'Wellness', count: 4 },
    { id: 'productivity', name: 'Productivity', count: 3 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'The Science Behind Mindful Breathing',
      excerpt: 'Discover how controlled breathing exercises can reduce stress and improve mental clarity through scientific research.',
      category: 'meditation',
      author: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      readTime: '5 min read',
      image: '/placeholder.svg?height=200&width=400',
      featured: true
    },
    {
      id: 2,
      title: 'Building Your Perfect Morning Ritual',
      excerpt: 'Learn how to create a personalized morning routine that sets you up for success and mindfulness throughout the day.',
      category: 'wellness',
      author: 'Michael Chen',
      date: '2024-01-12',
      readTime: '7 min read',
      image: '/placeholder.svg?height=200&width=400',
      featured: false
    },
    {
      id: 3,
      title: 'Mindful Productivity: Quality Over Quantity',
      excerpt: 'Explore how mindfulness practices can enhance your work performance and help you achieve better work-life balance.',
      category: 'productivity',
      author: 'Emma Wilson',
      date: '2024-01-10',
      readTime: '6 min read',
      image: '/placeholder.svg?height=200&width=400',
      featured: false
    },
    {
      id: 4,
      title: 'Understanding Stress: Your Body\'s Natural Response',
      excerpt: 'Learn about the physiology of stress and how modern mindfulness techniques can help you manage it effectively.',
      category: 'wellness',
      author: 'Dr. Robert Kim',
      date: '2024-01-08',
      readTime: '8 min read',
      image: '/placeholder.svg?height=200&width=400',
      featured: false
    },
    {
      id: 5,
      title: 'Meditation for Beginners: Your First Steps',
      excerpt: 'A comprehensive guide to starting your meditation journey with practical tips and common misconceptions addressed.',
      category: 'meditation',
      author: 'Lisa Rodriguez',
      date: '2024-01-05',
      readTime: '10 min read',
      image: '/placeholder.svg?height=200&width=400',
      featured: false
    },
    {
      id: 6,
      title: 'The Power of Digital Detox in Modern Life',
      excerpt: 'How taking breaks from technology can improve your mental health and enhance your mindfulness practice.',
      category: 'wellness',
      author: 'James Thompson',
      date: '2024-01-03',
      readTime: '4 min read',
      image: '/placeholder.svg?height=200&width=400',
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <>
      <Helmet>
        <title>Blog | Respiro Balance</title>
        <meta name="description" content="Explore articles about mindfulness, meditation, wellness, and productivity from the Respiro Balance team." />
      </Helmet>
      
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Wellness Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Insights, tips, and research on mindfulness, meditation, and living a balanced life.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{featuredPost.category}</Badge>
                      <Badge variant="outline">Featured</Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {featuredPost.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(featuredPost.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredPost.readTime}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        Read More <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Regular Posts Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
            {regularPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map(post => (
                  <Card key={post.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm">
                          Read More <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-300">No articles found matching your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Newsletter Signup */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest articles on mindfulness, wellness tips, and exclusive content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-white/90">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      
    </>
  );
};

export default BlogPage;
