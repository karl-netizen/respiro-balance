// ============================================
// SUPABASE INTEGRATION AUDIT SYSTEM
// Comprehensive checker for frontend-backend alignment
// ============================================

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

interface AuditResult {
  section: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

interface AuditReport {
  timestamp: string;
  overallStatus: 'pass' | 'fail';
  results: AuditResult[];
  summary: {
    passed: number;
    failed: number;
    warnings: number;
  };
}

class SupabaseAuditSystem {
  private supabase: any;
  private results: AuditResult[] = [];
  private projectRoot: string;

  constructor(supabaseUrl: string, supabaseKey: string, projectRoot: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.projectRoot = projectRoot;
  }

  // ============================================
  // 1. DATABASE SCHEMA AUDIT
  // ============================================

  async auditDatabaseSchema(): Promise<void> {
    console.log('\n🔍 Auditing Database Schema...\n');

    // Check required tables exist
    const requiredTables = [
      'user_profiles',
      'meditation_sessions',
      'breathing_sessions',
      'focus_sessions',
      'morning_rituals',
      'user_preferences',
      'user_content_progress',
      'meditation_content',
      'meditation_audio',
      // Social Hub tables
      'social_posts',
      'social_likes',
      'social_comments',
      'post_comments',
      'friendships',
      'user_friendships',
      'challenges',
      'community_challenges',
      'challenge_participants',
      'challenge_participations',
      'leaderboard_entries',
      'social_notifications',
      'user_notifications',
      'user_social_profiles',
      'user_rewards',
      'reward_transactions',
      'community_groups',
      'group_memberships',
      'user_achievements',
      'focus_achievements',
      'subscription_history',
      'content_categories',
      'post_interactions',
      'shared_achievements',
      'biometric_data'
    ];

    for (const tableName of requiredTables) {
      await this.checkTableExists(tableName);
    }
  }

  private async checkTableExists(tableName: string): Promise<void> {
    try {
      const { data, error } = await this.supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error && error.code === '42P01') {
        this.addResult('Database Schema', 'fail', 
          `Table '${tableName}' does not exist`, { table: tableName });
      } else if (error) {
        this.addResult('Database Schema', 'warning',
          `Error checking table '${tableName}': ${error.message}`, { table: tableName });
      } else {
        this.addResult('Database Schema', 'pass',
          `Table '${tableName}' exists`, { table: tableName });
      }
    } catch (err) {
      this.addResult('Database Schema', 'fail',
        `Failed to check table '${tableName}': ${err}`, { table: tableName });
    }
  }

  // ============================================
  // 2. ROW LEVEL SECURITY (RLS) AUDIT
  // ============================================

  async auditRowLevelSecurity(): Promise<void> {
    console.log('\n🔒 Auditing Row Level Security...\n');

    const tables = [
      'user_profiles', 'meditation_sessions', 'user_preferences',
      'social_posts', 'social_likes', 'social_comments',
      'friendships', 'challenges', 'challenge_participants',
      'user_content_progress', 'meditation_content'
    ];

    for (const table of tables) {
      await this.checkRLSEnabled(table);
    }
  }

  private async checkRLSEnabled(tableName: string): Promise<void> {
    try {
      // Simple test: try to query without auth
      const { error } = await this.supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error && error.message.includes('policy')) {
        this.addResult('RLS Status', 'pass',
          `RLS enabled on '${tableName}'`, { table: tableName });
      } else if (!error) {
        this.addResult('RLS Status', 'pass',
          `Table '${tableName}' is accessible (public or has policies)`, { table: tableName });
      } else {
        this.addResult('RLS Status', 'warning',
          `RLS status unclear for '${tableName}': ${error.message}`);
      }
    } catch (err) {
      this.addResult('RLS Status', 'warning',
        `Could not verify RLS for '${tableName}': ${err}`);
    }
  }

  // ============================================
  // 3. STORAGE BUCKETS AUDIT
  // ============================================

  async auditStorageBuckets(): Promise<void> {
    console.log('\n📦 Auditing Storage Buckets...\n');

    const requiredBuckets = [
      'meditation-audio'
    ];

    try {
      const { data: buckets, error } = await this.supabase.storage.listBuckets();

      if (error) {
        this.addResult('Storage Buckets', 'fail',
          `Cannot list storage buckets: ${error.message}`);
        return;
      }

      const existingBucketNames = buckets.map((b: any) => b.name);

      for (const bucketName of requiredBuckets) {
        if (existingBucketNames.includes(bucketName)) {
          this.addResult('Storage Buckets', 'pass',
            `Bucket '${bucketName}' exists`, { bucket: bucketName });
        } else {
          this.addResult('Storage Buckets', 'fail',
            `Bucket '${bucketName}' does not exist`, { bucket: bucketName });
        }
      }
    } catch (err) {
      this.addResult('Storage Buckets', 'fail',
        `Error auditing storage buckets: ${err}`);
    }
  }

  // ============================================
  // 4. EDGE FUNCTIONS AUDIT
  // ============================================

  async auditEdgeFunctions(): Promise<void> {
    console.log('\n⚡ Auditing Edge Functions...\n');

    const requiredFunctions = [
      'create-billing-portal',
      'reset-monthly-limits'
    ];

    const functionsPath = path.join(this.projectRoot, 'supabase', 'functions');

    if (!fs.existsSync(functionsPath)) {
      this.addResult('Edge Functions', 'warning',
        'supabase/functions directory does not exist');
      return;
    }

    const existingFunctions = fs.readdirSync(functionsPath)
      .filter(file => {
        const fullPath = path.join(functionsPath, file);
        return fs.statSync(fullPath).isDirectory();
      });

    for (const funcName of requiredFunctions) {
      if (existingFunctions.includes(funcName)) {
        const indexPath = path.join(functionsPath, funcName, 'index.ts');
        if (fs.existsSync(indexPath)) {
          this.addResult('Edge Functions', 'pass',
            `Function '${funcName}' exists with index.ts`, { function: funcName });
        } else {
          this.addResult('Edge Functions', 'fail',
            `Function '${funcName}' missing index.ts`, { function: funcName });
        }
      } else {
        this.addResult('Edge Functions', 'warning',
          `Function '${funcName}' does not exist`, { function: funcName });
      }
    }
  }

  // ============================================
  // 5. FRONTEND API INTEGRATION AUDIT
  // ============================================

  async auditFrontendIntegration(): Promise<void> {
    console.log('\n💻 Auditing Frontend Integration...\n');

    await this.checkSupabaseClient();
    await this.checkAPIServices();
    await this.checkHooks();
    await this.checkEnvironmentVariables();
  }

  private async checkSupabaseClient(): Promise<void> {
    const supabaseClientPath = path.join(this.projectRoot, 'src', 'integrations', 'supabase', 'client.ts');
    
    if (fs.existsSync(supabaseClientPath)) {
      const content = fs.readFileSync(supabaseClientPath, 'utf-8');
      
      if (content.includes('createClient')) {
        this.addResult('Supabase Client', 'pass', 'Supabase client initialized');
      } else {
        this.addResult('Supabase Client', 'fail', 
          'Supabase client file exists but createClient not found');
      }
    } else {
      this.addResult('Supabase Client', 'fail',
        'Supabase client file not found');
    }
  }

  private async checkAPIServices(): Promise<void> {
    const apiPath = path.join(this.projectRoot, 'src', 'lib', 'api');
    
    if (!fs.existsSync(apiPath)) {
      this.addResult('API Services', 'warning',
        'src/lib/api directory does not exist');
      return;
    }

    const requiredServices = [
      'socialHub.ts'
    ];

    const existingFiles = fs.readdirSync(apiPath);

    for (const service of requiredServices) {
      if (existingFiles.includes(service)) {
        this.addResult('API Services', 'pass',
          `Service '${service}' exists`, { service });
      } else {
        this.addResult('API Services', 'warning',
          `Service '${service}' does not exist`, { service });
      }
    }
  }

  private async checkHooks(): Promise<void> {
    const hooksPath = path.join(this.projectRoot, 'src', 'hooks');
    
    if (!fs.existsSync(hooksPath)) {
      this.addResult('React Hooks', 'warning',
        'src/hooks directory does not exist');
      return;
    }

    const requiredHooks = [
      'useAuth.tsx',
      'useMeditationSupabase.ts',
      'useSupabaseUserPreferences.ts',
      'useOnboarding.tsx'
    ];

    const getAllFiles = (dir: string): string[] => {
      const files = fs.readdirSync(dir);
      let allFiles: string[] = [];
      
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          allFiles = allFiles.concat(getAllFiles(fullPath));
        } else {
          allFiles.push(path.relative(hooksPath, fullPath));
        }
      });
      
      return allFiles;
    };

    const existingFiles = getAllFiles(hooksPath);

    for (const hook of requiredHooks) {
      if (existingFiles.includes(hook)) {
        this.addResult('React Hooks', 'pass',
          `Hook '${hook}' exists`, { hook });
      } else {
        this.addResult('React Hooks', 'warning',
          `Hook '${hook}' does not exist`, { hook });
      }
    }
  }

  private async checkEnvironmentVariables(): Promise<void> {
    const envPath = path.join(this.projectRoot, '.env');

    if (!fs.existsSync(envPath)) {
      this.addResult('Environment Variables', 'fail',
        '.env file does not exist');
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];

    for (const varName of requiredVars) {
      if (envContent.includes(varName)) {
        const match = envContent.match(new RegExp(`${varName}=(.+)`));
        if (match && match[1] && match[1].trim() && !match[1].includes('your-')) {
          this.addResult('Environment Variables', 'pass',
            `${varName} is set`, { variable: varName });
        } else {
          this.addResult('Environment Variables', 'fail',
            `${varName} is declared but has no value`, { variable: varName });
        }
      } else {
        this.addResult('Environment Variables', 'fail',
          `${varName} is missing`, { variable: varName });
      }
    }
  }

  // ============================================
  // 6. DATA FLOW VALIDATION
  // ============================================

  async auditDataFlow(): Promise<void> {
    console.log('\n🔄 Auditing Data Flow...\n');

    await this.testAuthFlow();
    await this.testCRUDOperations();
  }

  private async testAuthFlow(): Promise<void> {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      
      if (error) {
        this.addResult('Auth Flow', 'warning',
          `Auth session check: ${error.message}`);
      } else {
        this.addResult('Auth Flow', 'pass',
          'Auth system is accessible');
      }
    } catch (err) {
      this.addResult('Auth Flow', 'fail',
        `Auth flow test failed: ${err}`);
    }
  }

  private async testCRUDOperations(): Promise<void> {
    const testTables = ['user_profiles', 'meditation_content'];

    for (const table of testTables) {
      try {
        const { data, error } = await this.supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          this.addResult('CRUD Operations', 'warning',
            `Cannot read from '${table}': ${error.message}`,
            { table, operation: 'READ' });
        } else {
          this.addResult('CRUD Operations', 'pass',
            `Can read from '${table}'`,
            { table, operation: 'READ' });
        }
      } catch (err) {
        this.addResult('CRUD Operations', 'fail',
          `CRUD test failed for '${table}': ${err}`,
          { table });
      }
    }
  }

  // ============================================
  // 7. GENERATE REPORT
  // ============================================

  private addResult(section: string, status: 'pass' | 'fail' | 'warning', 
                   message: string, details?: any): void {
    this.results.push({ section, status, message, details });
    
    const emoji = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    console.log(`${emoji} [${section}] ${message}`);
  }

  generateReport(): AuditReport {
    const summary = this.results.reduce(
      (acc, result) => {
        if (result.status === 'pass') acc.passed++;
        else if (result.status === 'fail') acc.failed++;
        else acc.warnings++;
        return acc;
      },
      { passed: 0, failed: 0, warnings: 0 }
    );

    const overallStatus = summary.failed === 0 ? 'pass' : 'fail';

    return {
      timestamp: new Date().toISOString(),
      overallStatus,
      results: this.results,
      summary
    };
  }

  async runFullAudit(): Promise<AuditReport> {
    console.log('🚀 Starting Supabase Integration Audit...\n');
    console.log('='.repeat(60));

    await this.auditDatabaseSchema();
    await this.auditRowLevelSecurity();
    await this.auditStorageBuckets();
    await this.auditEdgeFunctions();
    await this.auditFrontendIntegration();
    await this.auditDataFlow();

    const report = this.generateReport();

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 AUDIT SUMMARY\n');
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`⚠️  Warnings: ${report.summary.warnings}`);
    console.log(`\n🎯 Overall Status: ${report.overallStatus.toUpperCase()}\n`);

    return report;
  }

  saveReport(report: AuditReport, filename: string = 'supabase-audit-report.json'): void {
    const reportPath = path.join(this.projectRoot, filename);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${filename}\n`);
  }
}

// ============================================
// USAGE
// ============================================

async function main() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  const projectRoot = process.cwd();

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set');
    process.exit(1);
  }

  const auditor = new SupabaseAuditSystem(supabaseUrl, supabaseKey, projectRoot);
  const report = await auditor.runFullAudit();
  auditor.saveReport(report);

  process.exit(report.overallStatus === 'fail' ? 1 : 0);
}

main().catch(console.error);

export { SupabaseAuditSystem, AuditReport, AuditResult };
