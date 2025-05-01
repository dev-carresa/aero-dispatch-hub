
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.0'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get Supabase client using environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: 'Missing Supabase environment variables' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const demoEmail = 'admin@example.com';
    const demoPassword = 'password';
    
    // Check if user exists
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
    
    if (getUserError) {
      throw getUserError;
    }
    
    const existingUser = users.find(user => user.email === demoEmail);
    
    if (existingUser) {
      // Update existing user
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: demoPassword, email_confirm: true }
      );
      
      if (updateError) {
        throw updateError;
      }
      
      console.log("Demo user password updated");
      
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: demoEmail,
        password: demoPassword,
        email_confirm: true,
        user_metadata: { name: 'Admin User', role: 'Admin' }
      });
      
      if (createError) {
        throw createError;
      }
      
      // Ensure profile has Admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'Admin', status: 'active', name: 'Admin User' })
        .eq('id', newUser.user.id);
        
      if (profileError) {
        throw profileError;
      }
      
      console.log("Demo user created");
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error setting up demo user:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
