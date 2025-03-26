
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mindflow to-mindflow-dark flex items-center justify-center">
                <span className="text-white font-semibold text-sm">R</span>
              </div>
              <h3 className="ml-2 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-mindflow-dark to-mindflow">
                Respiro Balance
              </h3>
            </div>
            <p className="text-sm text-foreground/70 mb-4">
              Find balance in your day with breathing and meditation tools designed for the modern workplace.
            </p>
            <div className="text-xs text-foreground/50 mb-2">
              Powered by:
            </div>
            <div className="text-sm font-medium mb-4">
              <div className="mb-1">KGP Coaching & Consulting</div>
              <div>LearnRelaxation</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-foreground/70 hover:text-primary">Home</a></li>
              <li><a href="#features" className="text-foreground/70 hover:text-primary">Features</a></li>
              <li><a href="#pricing" className="text-foreground/70 hover:text-primary">Pricing</a></li>
              <li><a href="/breathe" className="text-foreground/70 hover:text-primary">Breathing Tools</a></li>
              <li><a href="/meditate" className="text-foreground/70 hover:text-primary">Meditation Library</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/faq" className="text-foreground/70 hover:text-primary">FAQ</a></li>
              <li><a href="/contact" className="text-foreground/70 hover:text-primary">Contact Us</a></li>
              <li><a href="/privacy" className="text-foreground/70 hover:text-primary">Privacy Policy</a></li>
              <li><a href="/terms" className="text-foreground/70 hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-foreground/70 hover:text-primary" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
            <div>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/10 mt-8 pt-8 text-center text-sm text-foreground/60">
          <p>© {currentYear} Respiro Balance. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Created with <Heart size={12} className="inline text-primary" /> by KGP Coaching & Consulting and LearnRelaxation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
