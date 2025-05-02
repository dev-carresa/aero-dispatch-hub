
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  CalendarClock,
  Car, 
  CheckCircle, 
  Clock, 
  Edit, 
  FileText, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Printer, 
  Share2, 
  Trash2,
  User,
  Plus
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/bookingService";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => id ? bookingService.getBookingById(id) : null,
    enabled: !!id
  });

  const handleDelete = async () => {
    if (!id || !window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      return;
    }
    
    try {
      await bookingService.deleteBooking(id);
      toast.success("Réservation supprimée avec succès");
      navigate('/bookings');
    } catch (error) {
      toast.error("Erreur lors de la suppression de la réservation");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500">Erreur lors du chargement de la réservation</h2>
        <p className="text-muted-foreground mt-2">Impossible de trouver les détails de cette réservation</p>
        <Link to="/bookings" className="mt-4 inline-block">
          <Button variant="secondary">Retour aux réservations</Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMMM yyyy", { locale: fr });
    } catch (e) {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      return `${formatDate(dateStr)} à ${timeStr}`;
    } catch (e) {
      return `${dateStr} ${timeStr}`;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <Link to="/bookings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              Réservation #{id?.substring(0, 6)}
              <Badge className={
                booking.status === 'confirmed' 
                  ? 'bg-green-500' 
                  : booking.status === 'completed'
                  ? 'bg-blue-500'
                  : booking.status === 'cancelled'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </h2>
            <p className="text-muted-foreground">
              Référence: REF-{id?.substring(0, 6)} • Créé le: {formatDate(booking.created_at)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Link to={`/bookings/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Informations Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{booking.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{booking.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{booking.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>Passagers: {booking.passenger_count}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>Bagages: {booking.luggage_count}</span>
                  </div>
                  {booking.flight_number && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>Vol: {booking.flight_number}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Détails du Trajet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Lieu de prise en charge</p>
                      <p className="font-medium">{booking.pickup_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium">{booking.destination}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date & heure de prise en charge</p>
                      <p className="font-medium">{formatDateTime(booking.pickup_date, booking.pickup_time)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Véhicule & Chauffeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Type de véhicule</p>
                      <p className="font-medium">{booking.vehicle_type.charAt(0).toUpperCase() + booking.vehicle_type.slice(1)}</p>
                    </div>
                  </div>
                  {booking.tracking_status && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Statut de suivi</p>
                          <p className="font-medium">{booking.tracking_status}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Informations de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Montant</span>
                    <span className="font-medium">${booking.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Méthode de paiement</span>
                    <span className="font-medium">
                      {booking.payment_method === 'credit-card' ? 'Carte de crédit' : 
                       booking.payment_method === 'cash' ? 'Espèces' : 
                       booking.payment_method === 'invoice' ? 'Facture' : 
                       booking.payment_method === 'paypal' ? 'PayPal' : 
                       booking.payment_method}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Statut du paiement</span>
                    <Badge variant="outline" className="font-medium">
                      {booking.payment_status === 'paid' ? 'Payé' : 
                       booking.payment_status === 'pending' ? 'En attente' : 
                       booking.payment_status === 'failed' ? 'Échoué' : 
                       booking.payment_status}
                    </Badge>
                  </div>
                  {booking.payment_notes && (
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-muted-foreground">Notes de paiement</span>
                      <p className="text-sm">{booking.payment_notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{booking.special_instructions || "Aucune note disponible."}</p>
                {booking.admin_notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm">Notes administratives</h4>
                    <p className="text-sm text-muted-foreground">{booking.admin_notes}</p>
                  </div>
                )}
                {booking.driver_notes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm">Notes chauffeur</h4>
                    <p className="text-sm text-muted-foreground">{booking.driver_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique d'activité</CardTitle>
              <CardDescription>Historique complet de cette réservation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative pl-8 pb-6 border-l border-muted">
                  <div className="absolute w-6 h-6 rounded-full bg-primary flex items-center justify-center -left-3 top-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Réservation {booking.status === 'confirmed' ? 'confirmée' : 'créée'}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(booking.created_at)}</p>
                  </div>
                </div>
                
                {booking.updated_at !== booking.created_at && (
                  <div className="relative pl-8">
                    <div className="absolute w-6 h-6 rounded-full bg-muted-foreground flex items-center justify-center -left-3 top-0">
                      <Edit className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Réservation mise à jour</p>
                      <p className="text-sm text-muted-foreground">{formatDate(booking.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Historique de communication pour cette réservation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">Aucun message pour cette réservation</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de facturation</CardTitle>
              <CardDescription>Détails sur le paiement et la facturation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-3 px-4 text-left">Description</th>
                        <th className="py-3 px-4 text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-3 px-4">Transport - {booking.pickup_location} à {booking.destination}</td>
                        <td className="py-3 px-4 text-right">${booking.price}</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-3 px-4 font-medium">Total</td>
                        <td className="py-3 px-4 text-right font-medium">${booking.price}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Historique des paiements</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Méthode</th>
                          <th className="py-3 px-4 text-left">Statut</th>
                          <th className="py-3 px-4 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="py-3 px-4">{formatDate(booking.created_at)}</td>
                          <td className="py-3 px-4">
                            {booking.payment_method === 'credit-card' ? 'Carte de crédit' : 
                             booking.payment_method === 'cash' ? 'Espèces' : 
                             booking.payment_method === 'invoice' ? 'Facture' : 
                             booking.payment_method === 'paypal' ? 'PayPal' : 
                             booking.payment_method}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              booking.payment_status === 'paid' 
                                ? 'bg-green-50 text-green-700 ring-green-600/20' 
                                : booking.payment_status === 'pending'
                                ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                : 'bg-red-50 text-red-700 ring-red-600/20'
                            }`}>
                              {booking.payment_status === 'paid' ? 'Payé' : 
                               booking.payment_status === 'pending' ? 'En attente' : 
                               booking.payment_status === 'failed' ? 'Échoué' : 
                               booking.payment_status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">${booking.price}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingDetails;
