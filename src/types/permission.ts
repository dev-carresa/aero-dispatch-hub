
import { Permission } from "@/lib/permissions";

export interface RoleData {
  id: string;
  name: string;
  permissions: Record<Permission, boolean>;
  isBuiltIn: boolean;
  description?: string;
  userCount?: number;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: string;
  role: string;
}

export type RoleOperationType = 'edit' | 'copy';

// Group permissions by category for better organization
export const permissionCategories: Record<string, { description: string; permissions: string[] }> = {
  "Dashboard": {
    description: "Accès et contrôle du tableau de bord",
    permissions: ["dashboard:view"]
  },
  "Bookings": {
    description: "Gestion des réservations",
    permissions: ["bookings:view", "bookings:create", "bookings:edit", "bookings:delete", "bookings:assign_driver"]
  },
  "Users": {
    description: "Gestion des utilisateurs",
    permissions: ["users:view", "users:create", "users:edit", "users:delete"]
  },
  "API Users": {
    description: "Gestion des utilisateurs API",
    permissions: ["api_users:view", "api_users:create", "api_users:edit", "api_users:delete"]
  },
  "Vehicles": {
    description: "Gestion des véhicules",
    permissions: ["vehicles:view", "vehicles:create", "vehicles:edit", "vehicles:delete"]
  },
  "Airports/Meeting Points": {
    description: "Gestion des aéroports et points de rencontre",
    permissions: ["airports:view", "airports:create", "airports:edit", "airports:delete"]
  },
  "Reports": {
    description: "Création et visualisation des rapports",
    permissions: ["reports:view", "reports:create"]
  },
  "Complaints": {
    description: "Gestion des réclamations",
    permissions: ["complaints:view", "complaints:create", "complaints:respond"]
  },
  "Driver Comments": {
    description: "Commentaires des conducteurs",
    permissions: ["driver_comments:view", "driver_comments:create"]
  },
  "Quality Reviews": {
    description: "Évaluations de qualité",
    permissions: ["quality_reviews:view"]
  },
  "Invoices": {
    description: "Gestion des factures",
    permissions: ["invoices:view", "invoices:create", "invoices:edit"]
  },
  "Settings": {
    description: "Configuration du système",
    permissions: ["settings:view", "settings:edit", "settings:permissions", "settings:api"]
  }
};

// Permission descriptions for tooltips
export const permissionDescriptions: Record<string, string> = {
  "dashboard:view": "Voir le tableau de bord et les statistiques",
  "bookings:view": "Voir les réservations",
  "bookings:create": "Créer de nouvelles réservations",
  "bookings:edit": "Modifier les réservations existantes",
  "bookings:delete": "Supprimer des réservations",
  "bookings:assign_driver": "Assigner des chauffeurs aux réservations",
  "users:view": "Voir la liste des utilisateurs",
  "users:create": "Créer de nouveaux utilisateurs",
  "users:edit": "Modifier les utilisateurs existants",
  "users:delete": "Supprimer des utilisateurs",
  "api_users:view": "Voir les utilisateurs API",
  "api_users:create": "Créer de nouveaux utilisateurs API",
  "api_users:edit": "Modifier les utilisateurs API",
  "api_users:delete": "Supprimer des utilisateurs API",
  "vehicles:view": "Voir les véhicules",
  "vehicles:create": "Ajouter de nouveaux véhicules",
  "vehicles:edit": "Modifier les véhicules existants",
  "vehicles:delete": "Supprimer des véhicules",
  "airports:view": "Voir les aéroports et points de rencontre",
  "airports:create": "Créer de nouveaux aéroports",
  "airports:edit": "Modifier les aéroports existants",
  "airports:delete": "Supprimer des aéroports",
  "reports:view": "Voir les rapports",
  "reports:create": "Créer de nouveaux rapports",
  "complaints:view": "Voir les réclamations",
  "complaints:create": "Créer de nouvelles réclamations",
  "complaints:respond": "Répondre aux réclamations",
  "driver_comments:view": "Voir les commentaires des conducteurs",
  "driver_comments:create": "Créer des commentaires de conducteur",
  "quality_reviews:view": "Voir les évaluations de qualité",
  "invoices:view": "Voir les factures",
  "invoices:create": "Créer de nouvelles factures",
  "invoices:edit": "Modifier les factures existantes",
  "settings:view": "Voir les paramètres",
  "settings:edit": "Modifier les paramètres généraux",
  "settings:permissions": "Gérer les permissions et les rôles",
  "settings:api": "Configurer les paramètres API"
};

// Role colors for badges
export const roleColorClasses: Record<string, string> = {
  "Admin": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  "Driver": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "Fleet": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  "Dispatcher": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "Customer": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
};
