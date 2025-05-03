export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      airports: {
        Row: {
          city: string
          code: string
          country: string
          created_at: string
          id: number
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          city: string
          code: string
          country: string
          created_at?: string
          id?: number
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          city?: string
          code?: string
          country?: string
          created_at?: string
          id?: number
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_integrations: {
        Row: {
          api_title: string
          category: string
          created_at: string
          enabled: boolean
          error: string | null
          id: string
          key_name: string
          key_value: string | null
          last_tested: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_title: string
          category: string
          created_at?: string
          enabled?: boolean
          error?: string | null
          id?: string
          key_name: string
          key_value?: string | null
          last_tested?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_title?: string
          category?: string
          created_at?: string
          enabled?: boolean
          error?: string | null
          id?: string
          key_name?: string
          key_value?: string | null
          last_tested?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      api_users: {
        Row: {
          api_key: string
          company: string | null
          country: string
          created_at: string
          email: string
          id: number
          last_used: string | null
          name: string
          notes: string | null
          phone: string | null
          secret_key: string | null
          service_type: string
          status: string
        }
        Insert: {
          api_key: string
          company?: string | null
          country: string
          created_at?: string
          email: string
          id?: number
          last_used?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          secret_key?: string | null
          service_type: string
          status: string
        }
        Update: {
          api_key?: string
          company?: string | null
          country?: string
          created_at?: string
          email?: string
          id?: number
          last_used?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          secret_key?: string | null
          service_type?: string
          status?: string
        }
        Relationships: []
      }
      attachments: {
        Row: {
          complaint_id: string | null
          complaint_reply_id: string | null
          created_at: string
          id: string
          name: string
          size: number
          type: string
          url: string
        }
        Insert: {
          complaint_id?: string | null
          complaint_reply_id?: string | null
          created_at?: string
          id?: string
          name: string
          size: number
          type: string
          url: string
        }
        Update: {
          complaint_id?: string | null
          complaint_reply_id?: string | null
          created_at?: string
          id?: string
          name?: string
          size?: number
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_complaint_reply_id_fkey"
            columns: ["complaint_reply_id"]
            isOneToOne: false
            referencedRelation: "complaint_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          customer: string
          customer_id: string | null
          date: string
          destination: string
          driver: string
          driver_id: string | null
          fleet: string | null
          fleet_id: string | null
          flight_number: string | null
          id: string
          origin: string
          price: string
          reference: string | null
          service_type: string | null
          source: string | null
          status: string
          time: string
          updated_at: string
          vehicle: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          customer: string
          customer_id?: string | null
          date: string
          destination: string
          driver: string
          driver_id?: string | null
          fleet?: string | null
          fleet_id?: string | null
          flight_number?: string | null
          id?: string
          origin: string
          price: string
          reference?: string | null
          service_type?: string | null
          source?: string | null
          status: string
          time: string
          updated_at?: string
          vehicle: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          customer?: string
          customer_id?: string | null
          date?: string
          destination?: string
          driver?: string
          driver_id?: string | null
          fleet?: string | null
          fleet_id?: string | null
          flight_number?: string | null
          id?: string
          origin?: string
          price?: string
          reference?: string | null
          service_type?: string | null
          source?: string | null
          status?: string
          time?: string
          updated_at?: string
          vehicle?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_fleet_id_fkey"
            columns: ["fleet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings_data: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          customer_name: string
          destination: string
          driver_income: number | null
          driver_notes: string | null
          email: string
          fleet_income: number | null
          flight_number: string | null
          id: string
          luggage_count: number
          passenger_count: number
          payment_method: string
          payment_notes: string | null
          payment_status: string
          phone: string
          pickup_date: string
          pickup_location: string
          pickup_time: string
          price: number
          reference_source: string | null
          source: string | null
          special_instructions: string | null
          status: string
          tracking_status: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_type: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          customer_name: string
          destination: string
          driver_income?: number | null
          driver_notes?: string | null
          email: string
          fleet_income?: number | null
          flight_number?: string | null
          id?: string
          luggage_count: number
          passenger_count: number
          payment_method: string
          payment_notes?: string | null
          payment_status: string
          phone: string
          pickup_date: string
          pickup_location: string
          pickup_time: string
          price: number
          reference_source?: string | null
          source?: string | null
          special_instructions?: string | null
          status: string
          tracking_status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          customer_name?: string
          destination?: string
          driver_income?: number | null
          driver_notes?: string | null
          email?: string
          fleet_income?: number | null
          flight_number?: string | null
          id?: string
          luggage_count?: number
          passenger_count?: number
          payment_method?: string
          payment_notes?: string | null
          payment_status?: string
          phone?: string
          pickup_date?: string
          pickup_location?: string
          pickup_time?: string
          price?: number
          reference_source?: string | null
          source?: string | null
          special_instructions?: string | null
          status?: string
          tracking_status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string
        }
        Relationships: []
      }
      complaint_replies: {
        Row: {
          complaint_id: string
          id: string
          message: string
          sender_id: string
          sender_name: string
          sender_role: string
          timestamp: string
        }
        Insert: {
          complaint_id: string
          id?: string
          message: string
          sender_id: string
          sender_name: string
          sender_role: string
          timestamp?: string
        }
        Update: {
          complaint_id?: string
          id?: string
          message?: string
          sender_id?: string
          sender_name?: string
          sender_role?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaint_replies_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaint_replies_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          booking_reference: string
          created_at: string
          fleet_id: string
          fleet_name: string
          id: string
          message: string
          reference: string
          status: string
          updated_at: string
        }
        Insert: {
          booking_reference: string
          created_at?: string
          fleet_id: string
          fleet_name: string
          id?: string
          message: string
          reference: string
          status: string
          updated_at?: string
        }
        Update: {
          booking_reference?: string
          created_at?: string
          fleet_id?: string
          fleet_name?: string
          id?: string
          message?: string
          reference?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_fleet_id_fkey"
            columns: ["fleet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_comments: {
        Row: {
          booking_reference: string | null
          comment: string
          created_at: string
          driver_id: number
          driver_name: string
          id: string
          status: string
        }
        Insert: {
          booking_reference?: string | null
          comment: string
          created_at?: string
          driver_id: number
          driver_name: string
          id?: string
          status: string
        }
        Update: {
          booking_reference?: string | null
          comment?: string
          created_at?: string
          driver_id?: number
          driver_name?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          customer_id: string | null
          customer_name: string
          due_date: string
          fleet_id: string | null
          fleet_name: string | null
          id: string
          issue_date: string
          notes: string | null
          reference: string
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          customer_name: string
          due_date: string
          fleet_id?: string | null
          fleet_name?: string | null
          id?: string
          issue_date?: string
          notes?: string | null
          reference: string
          status: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          due_date?: string
          fleet_id?: string | null
          fleet_name?: string | null
          id?: string
          issue_date?: string
          notes?: string | null
          reference?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_fleet_id_fkey"
            columns: ["fleet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_points: {
        Row: {
          airport_id: number
          created_at: string
          fleet_id: string | null
          fleet_name: string | null
          id: number
          image_url: string
          latitude: number
          longitude: number
          pickup_instructions: string
          terminal: string
          updated_at: string
        }
        Insert: {
          airport_id: number
          created_at?: string
          fleet_id?: string | null
          fleet_name?: string | null
          id?: number
          image_url: string
          latitude: number
          longitude: number
          pickup_instructions: string
          terminal: string
          updated_at?: string
        }
        Update: {
          airport_id?: number
          created_at?: string
          fleet_id?: string | null
          fleet_name?: string | null
          id?: number
          image_url?: string
          latitude?: number
          longitude?: number
          pickup_instructions?: string
          terminal?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_points_airport_id_fkey"
            columns: ["airport_id"]
            isOneToOne: false
            referencedRelation: "airports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_points_fleet_id_fkey"
            columns: ["fleet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          country_code: string | null
          created_at: string
          date_of_birth: string | null
          driver_availability: string | null
          email: string
          first_name: string | null
          fleet_id: string | null
          id: string
          image_url: string | null
          last_active: string | null
          last_name: string | null
          name: string
          nationality: string | null
          phone: string | null
          role: string
          role_id: string | null
          status: string
          updated_at: string
          vehicle_type: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          driver_availability?: string | null
          email: string
          first_name?: string | null
          fleet_id?: string | null
          id: string
          image_url?: string | null
          last_active?: string | null
          last_name?: string | null
          name: string
          nationality?: string | null
          phone?: string | null
          role: string
          role_id?: string | null
          status: string
          updated_at?: string
          vehicle_type?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string
          date_of_birth?: string | null
          driver_availability?: string | null
          email?: string
          first_name?: string | null
          fleet_id?: string | null
          id?: string
          image_url?: string | null
          last_active?: string | null
          last_name?: string | null
          name?: string
          nationality?: string | null
          phone?: string | null
          role?: string
          role_id?: string | null
          status?: string
          updated_at?: string
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_reviews: {
        Row: {
          booking_reference: string
          customer_name: string | null
          driver_id: number
          driver_name: string
          fleet_id: number
          fleet_name: string
          id: string
          message: string
          review_date: string
          score: string
          star_rating: number
        }
        Insert: {
          booking_reference: string
          customer_name?: string | null
          driver_id: number
          driver_name: string
          fleet_id: number
          fleet_name: string
          id?: string
          message: string
          review_date?: string
          score: string
          star_rating: number
        }
        Update: {
          booking_reference?: string
          customer_name?: string | null
          driver_id?: number
          driver_name?: string
          fleet_id?: number
          fleet_name?: string
          id?: string
          message?: string
          review_date?: string
          score?: string
          star_rating?: number
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          created_by: number
          filters: Json
          id: number
          name: string
          results: Json | null
          status: string
          total_bookings: number | null
          total_income: number | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: number
          filters: Json
          id?: number
          name: string
          results?: Json | null
          status: string
          total_bookings?: number | null
          total_income?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: number
          filters?: Json
          id?: number
          name?: string
          results?: Json | null
          status?: string
          total_bookings?: number | null
          total_income?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      tracking_history: {
        Row: {
          booking_id: string
          coords: Json
          id: string
          location: string
          notes: string | null
          status: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          booking_id: string
          coords: Json
          id?: string
          location: string
          notes?: string | null
          status: string
          timestamp: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string
          coords?: Json
          id?: string
          location?: string
          notes?: string | null
          status?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_history_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracking_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          created_by: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method: string
          reference: string | null
          status: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method: string
          reference?: string | null
          status: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string
          reference?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          assigned_driver_id: string | null
          capacity: number
          color: string
          created_at: string
          fleet_id: string | null
          fuel_type: string
          id: string
          image_url: string | null
          insurance_expiry: string | null
          last_maintenance: string | null
          license_plate: string
          make: string
          mileage: number
          model: string
          next_maintenance: string | null
          notes: string | null
          registration_number: string | null
          status: string
          technical_control_expiry: string | null
          type: string
          updated_at: string
          vin: string
          year: number
        }
        Insert: {
          assigned_driver_id?: string | null
          capacity: number
          color: string
          created_at?: string
          fleet_id?: string | null
          fuel_type: string
          id?: string
          image_url?: string | null
          insurance_expiry?: string | null
          last_maintenance?: string | null
          license_plate: string
          make: string
          mileage: number
          model: string
          next_maintenance?: string | null
          notes?: string | null
          registration_number?: string | null
          status: string
          technical_control_expiry?: string | null
          type: string
          updated_at?: string
          vin: string
          year: number
        }
        Update: {
          assigned_driver_id?: string | null
          capacity?: number
          color?: string
          created_at?: string
          fleet_id?: string | null
          fuel_type?: string
          id?: string
          image_url?: string | null
          insurance_expiry?: string | null
          last_maintenance?: string | null
          license_plate?: string
          make?: string
          mileage?: number
          model?: string
          next_maintenance?: string | null
          notes?: string | null
          registration_number?: string | null
          status?: string
          technical_control_expiry?: string | null
          type?: string
          updated_at?: string
          vin?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_fleet_id_fkey"
            columns: ["fleet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_permission_to_role: {
        Args: { p_role_id: string; p_permission_id: string }
        Returns: undefined
      }
      add_permission_to_role_by_name: {
        Args: { p_role_id: string; p_permission_name: string }
        Returns: undefined
      }
      admin_create_permission_functions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      admin_seed_roles_and_permissions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_role: {
        Args: { p_name: string; p_description: string }
        Returns: string
      }
      delete_role: {
        Args: { p_role_id: string }
        Returns: undefined
      }
      get_all_permissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          description: string
          created_at: string
        }[]
      }
      get_all_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          description: string
          is_system: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_profile_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_role_permissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          role_id: string
          permission_name: string
        }[]
      }
      get_user_permissions: {
        Args: { user_id: string }
        Returns: {
          permission_name: string
        }[]
      }
      get_user_role_name: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_dispatcher: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_driver: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_fleet: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      remove_permission_from_role: {
        Args: { p_role_id: string; p_permission_id: string }
        Returns: undefined
      }
      remove_permission_from_role_by_name: {
        Args: { p_role_id: string; p_permission_name: string }
        Returns: undefined
      }
      update_user_role: {
        Args: { p_user_id: string; p_role_id: string }
        Returns: undefined
      }
      update_user_role_by_name: {
        Args: { p_user_id: string; p_role_name: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
