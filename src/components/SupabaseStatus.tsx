import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Loader2, Database } from 'lucide-react';
import { config } from '../utils/config';
import { supabase } from '../utils/supabaseClient';

export function SupabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'disabled'>('checking');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (!config.useSupabase) {
      setStatus('disabled');
      return;
    }

    try {
      // Use a lightweight query to check Supabase connectivity
      const { error } = await supabase
        .from('products')
        .select('id')
        .limit(1);

      if (error) {
        // If we get an auth error, try without auth (public access)
        if (error.message.includes('JWT') || error.code === 'PGRST301') {
          setStatus('disconnected');
          return;
        }
        throw error;
      }

      setStatus('connected');
    } catch (error) {
      console.error('Supabase health check failed:', error);
      setStatus('disconnected');
    }
  };

  if (status === 'disabled') {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
        <Database className="h-3 w-3 mr-1" />
        Local Mode
      </Badge>
    );
  }

  if (status === 'checking') {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        Checking...
      </Badge>
    );
  }

  if (status === 'connected') {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Supabase Active
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
      <XCircle className="h-3 w-3 mr-1" />
      Backend Offline
    </Badge>
  );
}
