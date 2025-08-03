#!/usr/bin/env node

/**
 * Security Audit Script
 * Run this before deployment to check for security issues
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Security checks
const securityChecks = [
  {
    name: 'Environment Variables',
    check: () => {
      const envExample = fs.readFileSync('.env.example', 'utf8');
      const hasEnv = fs.existsSync('.env');
      
      if (!hasEnv && process.env.NODE_ENV !== 'production') {
        return { passed: false, message: '.env file missing for development' };
      }
      
      const requiredVars = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY',
        'VITE_APP_ENV'
      ];
      
      if (hasEnv) {
        const envContent = fs.readFileSync('.env', 'utf8');
        const missingVars = requiredVars.filter(varName => 
          !envContent.includes(varName)
        );
        
        if (missingVars.length > 0) {
          return { 
            passed: false, 
            message: `Missing required variables: ${missingVars.join(', ')}` 
          };
        }
      }
      
      return { passed: true, message: 'Environment configuration looks good' };
    }
  },
  
  {
    name: 'Hardcoded Secrets',
    check: () => {
      const srcFiles = getAllFiles('./src', ['.ts', '.tsx', '.js', '.jsx']);
      const suspiciousPatterns = [
        /sk_live_[a-zA-Z0-9]+/, // Stripe live keys
        /pk_live_[a-zA-Z0-9]+/, // Stripe publishable keys
        /AIza[0-9A-Za-z\\-_]{35}/, // Google API keys
        /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/, // UUIDs that might be secrets
      ];
      
      const findings = [];
      
      srcFiles.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf8');
        suspiciousPatterns.forEach((pattern, index) => {
          const matches = content.match(pattern);
          if (matches) {
            findings.push(`${filePath}: Suspicious pattern ${index + 1}`);
          }
        });
      });
      
      if (findings.length > 0) {
        return { 
          passed: false, 
          message: `Potential hardcoded secrets found:\n  ${findings.join('\n  ')}` 
        };
      }
      
      return { passed: true, message: 'No hardcoded secrets detected' };
    }
  },
  
  {
    name: 'Security Headers Configuration',
    check: () => {
      const htaccessExists = fs.existsSync('./public/.htaccess');
      
      if (!htaccessExists) {
        return { 
          passed: false, 
          message: 'Security headers configuration (.htaccess) not found' 
        };
      }
      
      const htaccessContent = fs.readFileSync('./public/.htaccess', 'utf8');
      const requiredHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'Content-Security-Policy'
      ];
      
      const missingHeaders = requiredHeaders.filter(header => 
        !htaccessContent.includes(header)
      );
      
      if (missingHeaders.length > 0) {
        return { 
          passed: false, 
          message: `Missing security headers: ${missingHeaders.join(', ')}` 
        };
      }
      
      return { passed: true, message: 'Security headers properly configured' };
    }
  },
  
  {
    name: 'Demo Mode in Production',
    check: () => {
      const envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';
      const isProduction = envContent.includes('VITE_APP_ENV=production');
      const demoEnabled = envContent.includes('VITE_DEMO_MODE=true');
      
      if (isProduction && demoEnabled) {
        return { 
          passed: false, 
          message: 'Demo mode is enabled in production environment' 
        };
      }
      
      return { passed: true, message: 'Demo mode properly configured' };
    }
  },
  
  {
    name: 'Dependencies Audit',
    check: () => {
      try {
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        // Check for known vulnerable packages (simplified check)
        const vulnerablePackages = [
          'lodash', // Example - would need actual vulnerability database
        ];
        
        const found = vulnerablePackages.filter(pkg => dependencies[pkg]);
        
        if (found.length > 0) {
          return { 
            passed: false, 
            message: `Potentially vulnerable packages: ${found.join(', ')}. Run npm audit for details.` 
          };
        }
        
        return { passed: true, message: 'No known vulnerable dependencies detected' };
      } catch (error) {
        return { passed: false, message: 'Could not read package.json' };
      }
    }
  }
];

// Helper function to get all files with specific extensions
function getAllFiles(dirPath, extensions, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      // Skip node_modules and dist directories
      if (!['node_modules', 'dist', '.git'].includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, extensions, arrayOfFiles);
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Run security checks
console.log(`${colors.blue}🛡️  Running Security Audit...${colors.reset}\n`);

let passedChecks = 0;
let totalChecks = securityChecks.length;

securityChecks.forEach((check, index) => {
  try {
    const result = check.check();
    
    if (result.passed) {
      console.log(`${colors.green}✅ ${check.name}${colors.reset}`);
      console.log(`   ${result.message}\n`);
      passedChecks++;
    } else {
      console.log(`${colors.red}❌ ${check.name}${colors.reset}`);
      console.log(`   ${result.message}\n`);
    }
  } catch (error) {
    console.log(`${colors.red}❌ ${check.name}${colors.reset}`);
    console.log(`   Error running check: ${error.message}\n`);
  }
});

// Summary
console.log(`${colors.blue}📊 Security Audit Summary${colors.reset}`);
console.log(`Passed: ${passedChecks}/${totalChecks} checks`);

if (passedChecks === totalChecks) {
  console.log(`${colors.green}🎉 All security checks passed!${colors.reset}`);
  process.exit(0);
} else {
  console.log(`${colors.yellow}⚠️  Some security issues need attention.${colors.reset}`);
  console.log(`${colors.yellow}Please review the failed checks above before deployment.${colors.reset}`);
  process.exit(1);
}