import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { 
  Alert, 
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";

export function SecuritySettings() {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: true,
    ipRestriction: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSessionData, setIsLoadingSessionData] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    { id: "current", device: "Chrome on Windows", lastActive: "Current session", ip: "192.168.1.1" },
    { id: "session-2", device: "Safari on MacOS", lastActive: "2 days ago", ip: "192.168.1.2" },
    { id: "session-3", device: "Mobile App on iPhone", lastActive: "5 days ago", ip: "192.168.1.3" }
  ]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    setPasswordError("");
  };

  const handleSecuritySettingChange = (key: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  const updatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Tous les champs sont requis");
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("Le nouveau mot de passe doit comporter au moins 8 caractères");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword
      });

      if (signInError) {
        setPasswordError("Mot de passe actuel incorrect");
        throw signInError;
      }

      // If sign-in successful, update the password
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (updateError) {
        throw updateError;
      }

      toast.success("Mot de passe mis à jour avec succès");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error updating password:", error);
      if (!passwordError) {
        setPasswordError("Une erreur est survenue lors de la mise à jour du mot de passe");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const saveSecuritySettings = () => {
    // Save security settings logic here
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Paramètres de sécurité enregistrés avec succès");
    }, 800);
  };

  const terminateSession = (sessionId: string) => {
    // In a real implementation, this would call the Supabase auth API
    // For now, we'll just simulate by removing from our local state
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    toast.success(`Session terminée: ${sessionId}`);
  };

  const terminateAllOtherSessions = async () => {
    setIsLoadingSessionData(true);
    try {
      // In a real implementation with Supabase this would call auth.signOut with scope: 'others'
      await supabase.auth.signOut({ scope: 'others' });
      
      // Keep only the current session in our state
      setActiveSessions(prev => prev.filter(session => session.id === "current"));
      toast.success("Toutes les autres sessions ont été terminées");
    } catch (error) {
      console.error("Error terminating sessions:", error);
      toast.error("Erreur lors de la fermeture des sessions");
    } finally {
      setIsLoadingSessionData(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Mot de passe</CardTitle>
          <CardDescription>Mettez à jour votre mot de passe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <div className="relative">
              <Input 
                id="currentPassword" 
                type={showPasswords ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input 
              id="newPassword" 
              type={showPasswords ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
            <Input 
              id="confirmPassword" 
              type={showPasswords ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
          
          <Button 
            className="w-full" 
            onClick={updatePassword} 
            disabled={isSaving}
          >
            {isSaving ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient">
        <CardHeader>
          <CardTitle>Paramètres de sécurité</CardTitle>
          <CardDescription>Configurez les options de sécurité de votre compte.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactor">Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
            </div>
            <Switch 
              id="twoFactor"
              checked={securitySettings.twoFactor}
              onCheckedChange={(checked) => handleSecuritySettingChange("twoFactor", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sessionTimeout">Expiration de session</Label>
              <p className="text-sm text-muted-foreground">Déconnexion automatique après 2 heures d'inactivité.</p>
            </div>
            <Switch 
              id="sessionTimeout"
              checked={securitySettings.sessionTimeout}
              onCheckedChange={(checked) => handleSecuritySettingChange("sessionTimeout", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ipRestriction">Restriction d'IP</Label>
              <p className="text-sm text-muted-foreground">Limiter la connexion à des adresses IP spécifiques.</p>
            </div>
            <Switch 
              id="ipRestriction"
              checked={securitySettings.ipRestriction}
              onCheckedChange={(checked) => handleSecuritySettingChange("ipRestriction", checked)}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={saveSecuritySettings}
            disabled={isSaving}
          >
            {isSaving ? "Enregistrement..." : "Enregistrer les paramètres de sécurité"}
          </Button>
        </CardContent>
      </Card>

      <Card className="hover-scale shadow-sm card-gradient md:col-span-2">
        <CardHeader>
          <CardTitle>Sessions actives</CardTitle>
          <CardDescription>Gérez vos sessions de connexion actives.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.map(session => (
              <div key={session.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-muted-foreground">Dernière activité: {session.lastActive}</p>
                    <p className="text-xs text-muted-foreground mt-1">IP: {session.ip}</p>
                  </div>
                  {session.id === "current" ? (
                    <Button variant="outline" size="sm">Session actuelle</Button>
                  ) : (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => terminateSession(session.id)}
                    >
                      Terminer
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button 
              className="w-full mt-4" 
              variant="outline" 
              onClick={terminateAllOtherSessions}
              disabled={isLoadingSessionData || activeSessions.length <= 1}
            >
              {isLoadingSessionData ? "Fermeture des sessions..." : "Fermer toutes les autres sessions"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
