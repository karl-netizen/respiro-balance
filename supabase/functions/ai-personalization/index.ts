import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, context } = await req.json();

    if (action === 'generate_recommendations') {
      // Fetch user data
      const [sessionsResult, preferencesResult, moodResult, biometricResult] = await Promise.all([
        supabase
          .from('meditation_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('meditation_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false })
          .limit(10),
        supabase
          .from('biometric_data')
          .select('*')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: false })
          .limit(5)
      ]);

      const sessions = sessionsResult.data || [];
      const preferences = preferencesResult.data;
      const recentMood = moodResult.data || [];
      const biometrics = biometricResult.data || [];

      // Build AI prompt with structured output
      const systemPrompt = `You are an AI wellness coach specializing in meditation and mindfulness recommendations for Respiro Balance app.

Your task is to analyze user behavior, preferences, and current context to recommend personalized meditation sessions.

Consider:
- User's meditation history and completion rates
- Time of day and typical usage patterns
- Current mood and stress levels
- Experience level and difficulty preferences
- Personal goals and preferences

Provide 5 personalized session recommendations with detailed reasoning.`;

      const userContext = `
User Profile:
- Total Sessions: ${sessions.length}
- Average Completion: ${sessions.length > 0 ? (sessions.reduce((sum, s) => sum + (s.completed ? 1 : 0), 0) / sessions.length * 100).toFixed(0) : 0}%
- Preferred Duration: ${preferences?.preferred_session_duration || 10} minutes
- Experience Level: ${preferences?.meditation_experience || 'beginner'}
- Goals: ${preferences?.meditation_goals?.join(', ') || 'stress reduction, better sleep'}

Recent Activity:
${sessions.slice(0, 5).map(s => `- ${s.session_type} (${s.duration}min, ${s.completed ? 'completed' : 'incomplete'})`).join('\n')}

Current Context:
- Time: ${context?.timeOfDay || new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
- Available Time: ${context?.availableTime || preferences?.preferred_session_duration || 15} minutes
- Current Mood: ${context?.currentMood || 5}/10
- Stress Level: ${context?.stressLevel || 5}/10
- Energy Level: ${context?.energyLevel || 5}/10

Recent Biometrics:
${biometrics.slice(0, 3).map(b => `- HR: ${b.heart_rate || 'N/A'}, HRV: ${b.heart_rate_variability || 'N/A'}, Stress: ${b.stress_score || 'N/A'}`).join('\n')}
`;

      // Call Lovable AI with structured output
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContext }
          ],
          tools: [{
            type: 'function',
            function: {
              name: 'provide_recommendations',
              description: 'Provide 5 personalized meditation session recommendations',
              parameters: {
                type: 'object',
                properties: {
                  recommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        sessionType: {
                          type: 'string',
                          enum: ['meditation', 'breathing', 'focus', 'sleep', 'stress_relief']
                        },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        duration: { type: 'number' },
                        difficulty: {
                          type: 'string',
                          enum: ['beginner', 'intermediate', 'advanced']
                        },
                        confidence: { type: 'number', minimum: 0, maximum: 1 },
                        reasoning: {
                          type: 'array',
                          items: { type: 'string' }
                        },
                        expectedBenefits: {
                          type: 'object',
                          properties: {
                            moodImprovement: { type: 'number', minimum: 1, maximum: 10 },
                            stressReduction: { type: 'number', minimum: 1, maximum: 10 },
                            focusImprovement: { type: 'number', minimum: 1, maximum: 10 }
                          }
                        },
                        tags: {
                          type: 'array',
                          items: { type: 'string' }
                        }
                      },
                      required: ['sessionType', 'title', 'description', 'duration', 'difficulty', 'confidence', 'reasoning', 'expectedBenefits', 'tags']
                    }
                  }
                },
                required: ['recommendations']
              }
            }
          }],
          tool_choice: { type: 'function', function: { name: 'provide_recommendations' } }
        }),
      });

      if (!aiResponse.ok) {
        if (aiResponse.status === 429) {
          return new Response(JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again later.',
            code: 'RATE_LIMIT'
          }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (aiResponse.status === 402) {
          return new Response(JSON.stringify({ 
            error: 'AI usage quota exceeded. Please add credits to continue.',
            code: 'QUOTA_EXCEEDED'
          }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        const errorText = await aiResponse.text();
        console.error('AI Gateway error:', aiResponse.status, errorText);
        return new Response(JSON.stringify({ error: 'AI service error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const aiData = await aiResponse.json();
      const toolCall = aiData.choices[0].message.tool_calls?.[0];
      
      if (!toolCall) {
        return new Response(JSON.stringify({ error: 'No recommendations generated' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const recommendations = JSON.parse(toolCall.function.arguments).recommendations;

      return new Response(JSON.stringify({ recommendations }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'record_feedback') {
      const { recommendationId, sessionData, feedback } = context;
      
      // Store feedback for learning
      await supabase
        .from('ai_recommendation_feedback')
        .insert({
          user_id: user.id,
          recommendation_id: recommendationId,
          session_data: sessionData,
          feedback: feedback,
          created_at: new Date().toISOString()
        });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-personalization function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
