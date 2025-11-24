import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Eye, Clock, GamepadIcon } from 'lucide-react';

interface PrivacyConsentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyConsent({ open, onOpenChange }: PrivacyConsentProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-5 w-5 text-primary" />
            Politica de Confidențialitate și Prelucrare Date
          </DialogTitle>
          <DialogDescription>
            Platformă educațională NumLit Games
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            {/* Introducere */}
            <section>
              <h3 className="font-semibold text-base mb-2">📋 Introducere</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bun venit la NumLit Games! Această platformă educațională este destinată elevilor și 
                profesorilor pentru învățare interactivă prin jocuri. Respectăm confidențialitatea datelor 
                tale și ne angajăm să protejăm informațiile personale în conformitate cu Regulamentul 
                General privind Protecția Datelor (GDPR).
              </p>
            </section>

            {/* Date colectate */}
            <section>
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Ce date colectăm?
              </h3>
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-1">1. Date de autentificare (Google OAuth)</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li>Adresa de email</li>
                    <li>Numele complet</li>
                    <li>Poza de profil (avatar)</li>
                    <li>ID-ul unic Google</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    * Aceste date sunt furnizate automat de Google când te autentifici.
                  </p>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-1 flex items-center gap-2">
                    <GamepadIcon className="h-4 w-4" />
                    2. Date de activitate educațională
                  </h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li>Numărul de autentificări pe platformă</li>
                    <li>Jocurile accesate (nume joc, dată și oră)</li>
                    <li>Timpul petrecut pe platformă (pentru statistici educaționale)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Scopul colectării */}
            <section>
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                De ce colectăm aceste date?
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Funcționarea platformei:</strong> Pentru a-ți crea și gestiona contul</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Monitorizare progres educațional:</strong> Profesorii pot vedea ce jocuri sunt preferate și cât timp petrec elevii pe platformă</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Îmbunătățirea experienței:</strong> Pentru a optimiza jocurile și conținutul educațional</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Administrare:</strong> Gestionarea accesului și a permisiunilor (elevi vs. profesori/administratori)</span>
                </li>
              </ul>
            </section>

            {/* Cine are acces */}
            <section>
              <h3 className="font-semibold text-base mb-3">🔐 Cine are acces la datele tale?</h3>
              <div className="space-y-2">
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">Administratori/Profesori</h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Pot vedea: nume, email, statistici de activitate (accesări jocuri, timp petrecut). 
                    <strong className="block mt-1">Nu pot vedea: parola ta (gestionată de Google).</strong>
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Alți elevi</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>NU</strong> pot vedea datele tale. Fiecare elev vede doar propriile informații.
                  </p>
                </div>
              </div>
            </section>

            {/* Securitate */}
            <section>
              <h3 className="font-semibold text-base mb-3">🛡️ Cum protejăm datele tale?</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Autentificare securizată prin Google OAuth (nu stocăm parolele)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Baza de date protejată cu Row Level Security (RLS) - fiecare utilizator accesează doar datele proprii</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Conexiuni criptate (HTTPS)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Serverele sunt gazduite în UE (Supabase - conforme GDPR)</span>
                </li>
              </ul>
            </section>

            {/* Drepturi utilizator */}
            <section>
              <h3 className="font-semibold text-base mb-3">⚖️ Drepturile tale (GDPR)</h3>
              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-900 dark:text-amber-100 mb-2">
                  Conform GDPR, ai următoarele drepturi:
                </p>
                <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-200 ml-4">
                  <li>• <strong>Dreptul de acces:</strong> Poți solicita o copie a datelor tale</li>
                  <li>• <strong>Dreptul la rectificare:</strong> Poți corecta datele incorecte</li>
                  <li>• <strong>Dreptul la ștergere:</strong> Poți solicita ștergerea contului și a datelor</li>
                  <li>• <strong>Dreptul la portabilitate:</strong> Poți primi datele într-un format ușor de folosit</li>
                  <li>• <strong>Dreptul la opoziție:</strong> Poți refuza prelucrarea datelor (cu excepția celor necesare pentru funcționare)</li>
                </ul>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-3">
                  Pentru exercitarea drepturilor, contactează administratorul platformei.
                </p>
              </div>
            </section>

            {/* Părinți/Tutori */}
            <section>
              <h3 className="font-semibold text-base mb-3">👨‍👩‍👧‍👦 Notă pentru părinți/tutori</h3>
              <p className="text-muted-foreground leading-relaxed">
                Dacă copilul tău (sub 16 ani) folosește această platformă, te rugăm să citești această 
                politică împreună cu el/ea. Platforma este destinată învățării și monitorizării progresului 
                educațional. Profesorii pot vedea statistici de utilizare pentru a înțelege mai bine nevoile 
                educaționale ale elevilor.
              </p>
            </section>

            {/* Retenție date */}
            <section>
              <h3 className="font-semibold text-base mb-3">📅 Cât timp păstrăm datele?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Datele tale sunt păstrate atâta timp cât contul este activ. Dacă soliciti ștergerea contului, 
                toate datele personale vor fi eliminate definitiv din baza de date în maximum 30 de zile.
              </p>
            </section>

            {/* Cookie-uri */}
            <section>
              <h3 className="font-semibold text-base mb-3">🍪 Cookie-uri și tehnologii similare</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Platforma folosește:
              </p>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• <strong>Cookie-uri esențiale:</strong> Pentru autentificare și funcționarea platformei</li>
                <li>• <strong>Session storage:</strong> Pentru a menține sesiunea ta activă</li>
                <li>• <strong>Local storage:</strong> Pentru preferințe (ex: setări jocuri)</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                Nu folosim cookie-uri de publicitate sau tracking extern.
              </p>
            </section>

            {/* Modificări */}
            <section>
              <h3 className="font-semibold text-base mb-3">🔄 Modificări ale politicii</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ne rezervăm dreptul de a actualiza această politică. Modificările vor fi comunicate prin 
                platformă sau email. Continuarea folosirii platformei după modificări reprezintă acceptarea 
                noii politici.
              </p>
            </section>

            {/* Contact */}
            <section className="border-t pt-4">
              <h3 className="font-semibold text-base mb-3">📧 Contact</h3>
              <p className="text-muted-foreground leading-relaxed">
                Pentru întrebări despre această politică sau pentru exercitarea drepturilor GDPR, 
                contactează administratorul platformei la adresa de email furnizată de școală/instituție.
              </p>
            </section>

            {/* Footer legal */}
            <section className="bg-muted/30 p-4 rounded-lg text-xs text-muted-foreground">
              <p className="mb-2">
                <strong>Data ultimei actualizări:</strong> {new Date().toLocaleDateString('ro-RO', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p>
                Această platformă este conformă cu:
              </p>
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Regulamentul (UE) 2016/679 (GDPR)</li>
                <li>Legea nr. 190/2018 privind protecția datelor în România</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

