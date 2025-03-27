import { Link } from "react-router-dom";
import { useUserPreferences } from "@/context";

const Footer = () => {
  const { preferences } = useUserPreferences();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/20 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Respiro Balance</h3>
            <p className="text-sm text-foreground/70">
              Your daily companion for mindfulness, meditation, and work-life balance.
            </p>
            {preferences.businessAttribution && (
              <p className="text-xs text-foreground/60">
                Brought to you by {preferences.businessAttribution}
              </p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#balance" className="hover:text-primary transition-colors">Work-Life Balance</Link></li>
              <li><Link to="/#features" className="hover:text-primary transition-colors">Meditation</Link></li>
              <li><Link to="/breathe" className="hover:text-primary transition-colors">Breathing Exercises</Link></li>
              <li><Link to="/progress" className="hover:text-primary transition-colors">Progress Tracking</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-foreground/10 text-sm text-foreground/60 flex flex-col md:flex-row justify-between items-center">
          <div>
            &copy; {currentYear} Respiro Balance. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-4">
              <a href="https://kgpcoaching.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                KGP Coaching & Consulting
              </a>
              <span>|</span>
              <a href="https://learnrelaxation.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                LearnRelaxation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
