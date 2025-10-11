import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const DatabaseTest = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      const results: any = {};
      
      // Test 1: Check if supabase client exists
      results.clientExists = !!supabase;
      console.log('🧪 Test 1 - Client exists:', results.clientExists);
      
      // Test 2: Check environment variables
      try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        results.envVars = {
          urlExists: !!url,
          urlValue: url,
          keyExists: !!key,
          keyPrefix: key?.substring(0, 20) + '...'
        };
        console.log('🧪 Test 2 - Environment:', results.envVars);
      } catch (err) {
        results.envVars = { error: String(err) };
        console.error('🧪 Test 2 - Error:', err);
      }
      
      // Test 3: Try to query meditation_content
      try {
        console.log('🧪 Test 3 - Querying meditation_content...');
        const { data, error, count } = await supabase
          .from('meditation_content')
          .select('*', { count: 'exact' })
          .eq('is_active', true)
          .limit(5);
        
        results.meditationContent = {
          success: !error,
          error: error?.message,
          count: count,
          dataLength: data?.length,
          firstItem: data?.[0],
          rawError: error
        };
        console.log('🧪 Test 3 - Result:', results.meditationContent);
      } catch (err) {
        results.meditationContent = { exception: String(err) };
        console.error('🧪 Test 3 - Exception:', err);
      }
      
      // Test 4: Try simple query without filters
      try {
        console.log('🧪 Test 4 - Simple query...');
        const { data, error } = await supabase
          .from('meditation_content')
          .select('id, title')
          .limit(1);
        
        results.simpleQuery = {
          success: !error,
          error: error?.message,
          data: data
        };
        console.log('🧪 Test 4 - Result:', results.simpleQuery);
      } catch (err) {
        results.simpleQuery = { exception: String(err) };
        console.error('🧪 Test 4 - Exception:', err);
      }
      
      // Test 5: Check auth status
      try {
        const { data: { session } } = await supabase.auth.getSession();
        results.auth = {
          isAuthenticated: !!session,
          userId: session?.user?.id
        };
        console.log('🧪 Test 5 - Auth:', results.auth);
      } catch (err) {
        results.auth = { error: String(err) };
        console.error('🧪 Test 5 - Error:', err);
      }
      
      setTestResults(results);
      setLoading(false);
      
      console.log('🧪 ALL TEST RESULTS:', results);
    };
    
    runTests();
  }, []);

  if (loading) {
    return <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <p className="font-bold">Running database tests...</p>
    </div>;
  }

  return (
    <div className="p-4 bg-gray-100 border border-gray-400 rounded space-y-4 max-w-4xl">
      <h2 className="text-xl font-bold">Database Connection Test Results</h2>
      
      <div className="space-y-2 text-sm">
        <div className={testResults.clientExists ? 'text-green-700' : 'text-red-700'}>
          <strong>✓ Supabase Client:</strong> {testResults.clientExists ? 'Exists' : 'Missing'}
        </div>
        
        <div>
          <strong>Environment Variables:</strong>
          <pre className="bg-white p-2 rounded mt-1 overflow-x-auto">
            {JSON.stringify(testResults.envVars, null, 2)}
          </pre>
        </div>
        
        <div className={testResults.meditationContent?.success ? 'text-green-700' : 'text-red-700'}>
          <strong>meditation_content Query:</strong>
          <pre className="bg-white p-2 rounded mt-1 overflow-x-auto">
            {JSON.stringify(testResults.meditationContent, null, 2)}
          </pre>
        </div>
        
        <div className={testResults.simpleQuery?.success ? 'text-green-700' : 'text-red-700'}>
          <strong>Simple Query:</strong>
          <pre className="bg-white p-2 rounded mt-1 overflow-x-auto">
            {JSON.stringify(testResults.simpleQuery, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>Authentication:</strong>
          <pre className="bg-white p-2 rounded mt-1 overflow-x-auto">
            {JSON.stringify(testResults.auth, null, 2)}
          </pre>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-300 rounded">
        <p className="font-semibold">Check browser console for detailed logs</p>
        <p className="text-xs mt-1">All test results are logged with 🧪 prefix</p>
      </div>
    </div>
  );
};
