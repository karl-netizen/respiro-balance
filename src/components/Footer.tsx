
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Circle, Heart } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
    // Scroll to top after navigation with slight delay for mobile
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Circle className="w-8 h-8 text-respiro-dark fill-respiro-default mr-2" />
              <span className="text-xl font-bold text-respiro-dark">Respiro Balance</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Transform your daily routine with mindful meditation, focused breathing, and balanced living.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
              <span>for mindful living</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavClick("/meditation")} 
                  className="text-gray-600 hover:text-respiro-dark transition-colors text-left"
                >
                  Meditation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("/focus")} 
                  className="text-gray-600 hover:text-respiro-dark transition-colors text-left"
                >
                  Focus Mode
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("/biofeedback")} 
                  className="text-gray-600 hover:text-respiro-dark transition-colors text-left"
                >
                  Biofeedback
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("/social")} 
                  className="text-gray-600 hover:text-respiro-dark transition-colors text-left"
                >
                  Community
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavClick("/help")} 
                  className="text-gray-600 hover:text-respiro-dark transition-colors text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("/contact")} 
                  className="text-gray-600 hover:text-respiro-dark transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("/privacy")} 
                  className="text-gray-600 hover:text-respiro-dark transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick("/terms")} 
                  className="text-gray-600 hover:text-respiro-dark transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 Respiro Balance. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-respiro-dark transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-respiro-dark transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
