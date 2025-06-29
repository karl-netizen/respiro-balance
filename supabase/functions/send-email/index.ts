
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  template: string;
  variables?: Record<string, any>;
  userId?: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, template, variables = {}, userId }: EmailRequest = await req.json();

    // Fetch email template
    const { data: templateData, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_name', template)
      .single();

    if (templateError || !templateData) {
      throw new Error(`Email template "${template}" not found`);
    }

    // Replace variables in template
    let htmlContent = templateData.html_content;
    let textContent = templateData.text_content || '';
    let subject = templateData.subject;

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value));
      textContent = textContent.replace(new RegExp(placeholder, 'g'), String(value));
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
    });

    // Send email using Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Respiro Balance <noreply@respirobalance.com>',
        to: [to],
        subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${resendData.message}`);
    }

    // Log email
    await supabase.from('email_logs').insert({
      user_id: userId,
      template_name: template,
      recipient_email: to,
      subject,
      status: 'sent',
      metadata: {
        resend_id: resendData.id,
        variables
      }
    });

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
