#!/usr/bin/env tsx

/**
 * Database Migration System with Rollback Support
 * Enterprise-grade migration management for Respiro Balance
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

interface Migration {
  id: string
  name: string
  applied_at: string
  checksum: string
}

interface MigrationFile {
  id: string
  name: string
  upSql: string
  downSql: string
  checksum: string
}

class MigrationManager {
  private supabase: any
  private migrationsPath = 'supabase/migrations'
  
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async ensureMigrationsTable() {
    const { error } = await this.supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.schema_migrations (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          checksum VARCHAR(64) NOT NULL
        );
      `
    })
    
    if (error) throw error
  }

  async getAppliedMigrations(): Promise<Migration[]> {
    const { data, error } = await this.supabase
      .from('schema_migrations')
      .select('*')
      .order('applied_at', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  loadMigrationFiles(): MigrationFile[] {
    if (!existsSync(this.migrationsPath)) {
      console.log('No migrations directory found')
      return []
    }

    const files = readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort()

    return files.map(file => {
      const content = readFileSync(join(this.migrationsPath, file), 'utf8')
      const [upSql, downSql] = this.parseMigrationFile(content)
      
      return {
        id: file.replace('.sql', ''),
        name: file,
        upSql,
        downSql,
        checksum: this.generateChecksum(content)
      }
    })
  }

  private parseMigrationFile(content: string): [string, string] {
    const parts = content.split('-- +migrate Down')
    const upSql = parts[0].replace('-- +migrate Up\n', '').trim()
    const downSql = parts[1]?.trim() || ''
    
    return [upSql, downSql]
  }

  private generateChecksum(content: string): string {
    // Simple checksum for demo - use crypto.createHash in production
    return Buffer.from(content).toString('base64').slice(0, 64)
  }

  async migrate() {
    console.log('🚀 Starting database migration...')
    
    await this.ensureMigrationsTable()
    
    const appliedMigrations = await this.getAppliedMigrations()
    const allMigrations = this.loadMigrationFiles()
    
    const appliedIds = new Set(appliedMigrations.map(m => m.id))
    const pendingMigrations = allMigrations.filter(m => !appliedIds.has(m.id))
    
    if (pendingMigrations.length === 0) {
      console.log('✅ Database is up to date')
      return
    }
    
    console.log(`📝 Found ${pendingMigrations.length} pending migrations`)
    
    for (const migration of pendingMigrations) {
      try {
        console.log(`⚡ Applying migration: ${migration.name}`)
        
        // Execute migration SQL
        const { error } = await this.supabase.rpc('exec_sql', {
          sql: migration.upSql
        })
        
        if (error) throw error
        
        // Record migration as applied
        const { error: insertError } = await this.supabase
          .from('schema_migrations')
          .insert({
            id: migration.id,
            name: migration.name,
            checksum: migration.checksum
          })
        
        if (insertError) throw insertError
        
        console.log(`✅ Successfully applied: ${migration.name}`)
        
      } catch (error) {
        console.error(`❌ Failed to apply migration ${migration.name}:`, error)
        throw error
      }
    }
    
    console.log('🎉 All migrations completed successfully!')
  }

  async rollback(targetMigrationId?: string) {
    console.log('🔄 Starting database rollback...')
    
    const appliedMigrations = await this.getAppliedMigrations()
    const allMigrations = this.loadMigrationFiles()
    
    if (appliedMigrations.length === 0) {
      console.log('📝 No migrations to rollback')
      return
    }
    
    // Find migrations to rollback
    let migrationsToRollback: Migration[]
    
    if (targetMigrationId) {
      const targetIndex = appliedMigrations.findIndex(m => m.id === targetMigrationId)
      if (targetIndex === -1) {
        throw new Error(`Migration ${targetMigrationId} not found`)
      }
      migrationsToRollback = appliedMigrations.slice(targetIndex + 1).reverse()
    } else {
      // Rollback last migration only
      migrationsToRollback = [appliedMigrations[appliedMigrations.length - 1]]
    }
    
    console.log(`📝 Rolling back ${migrationsToRollback.length} migrations`)
    
    for (const migration of migrationsToRollback) {
      try {
        const migrationFile = allMigrations.find(m => m.id === migration.id)
        
        if (!migrationFile || !migrationFile.downSql) {
          console.warn(`⚠️  No rollback SQL found for ${migration.name}`)
          continue
        }
        
        console.log(`⚡ Rolling back migration: ${migration.name}`)
        
        // Execute rollback SQL
        const { error } = await this.supabase.rpc('exec_sql', {
          sql: migrationFile.downSql
        })
        
        if (error) throw error
        
        // Remove migration record
        const { error: deleteError } = await this.supabase
          .from('schema_migrations')
          .delete()
          .eq('id', migration.id)
        
        if (deleteError) throw deleteError
        
        console.log(`✅ Successfully rolled back: ${migration.name}`)
        
      } catch (error) {
        console.error(`❌ Failed to rollback migration ${migration.name}:`, error)
        throw error
      }
    }
    
    console.log('🎉 Rollback completed successfully!')
  }

  async status() {
    console.log('📊 Migration Status:')
    
    const appliedMigrations = await this.getAppliedMigrations()
    const allMigrations = this.loadMigrationFiles()
    
    const appliedIds = new Set(appliedMigrations.map(m => m.id))
    
    console.log(`\n✅ Applied migrations (${appliedMigrations.length}):`)
    appliedMigrations.forEach(m => {
      console.log(`  - ${m.name} (${m.applied_at})`)
    })
    
    const pendingMigrations = allMigrations.filter(m => !appliedIds.has(m.id))
    console.log(`\n⏳ Pending migrations (${pendingMigrations.length}):`)
    pendingMigrations.forEach(m => {
      console.log(`  - ${m.name}`)
    })
  }
}

// CLI Interface
async function main() {
  const command = process.argv[2]
  const manager = new MigrationManager()
  
  try {
    switch (command) {
      case 'migrate':
        await manager.migrate()
        break
      case 'rollback':
        const target = process.argv[3]
        await manager.rollback(target)
        break
      case 'status':
        await manager.status()
        break
      default:
        console.log(`
Database Migration Manager for Respiro Balance

Usage:
  npm run db:migrate        - Apply pending migrations
  npm run db:rollback       - Rollback last migration
  npm run db:rollback <id>  - Rollback to specific migration
  npm run db:status         - Show migration status

Examples:
  npm run db:migrate
  npm run db:rollback 20240101_initial_schema
  npm run db:status
        `)
    }
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { MigrationManager }