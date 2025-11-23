import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/b3fba488-faeb-4081-a5a6-bf161bfa2928.png" 
              alt="NumLit Logo" 
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl">Bine ai venit la NumLit!</CardTitle>
          <CardDescription>
            Platformă educațională interactivă pentru copii
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full h-12 text-base"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Se încarcă...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Autentificare cu Google
              </>
            )}
          </Button>
          
          <div className="text-xs text-center text-muted-foreground space-y-2">
            <p>
              Prin autentificare, accepți să stocăm:
            </p>
            <ul className="text-left space-y-1 max-w-xs mx-auto">
              <li>• Numele și emailul tău</li>
              <li>• Numărul de accesări</li>
              <li>• Timpul petrecut pe platformă</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

