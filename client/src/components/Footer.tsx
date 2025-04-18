import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              Created with ❤️ by{' '}
              <a
                href="https://github.com/Sameers1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Sameer
              </a>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Sameers1/DreamCanvas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>DreamCanvas - Transform your dreams into art using AI</p>
          <p className="mt-1">© {new Date().getFullYear()} Sameer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 