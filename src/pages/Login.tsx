import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Loader2, Shield, Info } from 'lucide-react';
import { PrivacyConsent } from '@/components/PrivacyConsent';

export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);

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
          
          {/* Privacy Notice */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-900 dark:text-blue-100 space-y-2">
                <p className="font-medium">
                  Protecția datelor tale este importantă pentru noi!
                </p>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                  Prin autentificare, accepți să prelucrăm următoarele date în scopuri educaționale:
                </p>
                <ul className="text-blue-800 dark:text-blue-200 space-y-1 ml-4">
                  <li>• Nume, email și poză de profil (de la Google)</li>
                  <li>• Jocurile accesate și timpul petrecut pe platformă</li>
                  <li>• Numărul de accesări (pentru statistici educaționale)</li>
                </ul>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                  Datele sunt protejate conform GDPR și sunt vizibile doar pentru profesori/administratori în scopuri educaționale.
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs h-8 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
              onClick={() => setShowPrivacyDialog(true)}
            >
              <Info className="mr-2 h-3 w-3" />
              Citește politica completă de confidențialitate
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Platformă educațională conformă GDPR 🇪🇺
          </p>
        </CardContent>
      </Card>

      {/* Privacy Dialog */}
      <PrivacyConsent open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog} />
    </div>
  );
}

