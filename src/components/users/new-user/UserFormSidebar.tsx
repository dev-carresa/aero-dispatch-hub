
interface UserFormSidebarProps {
  isDriverForm: boolean;
}

export const UserFormSidebar = ({ isDriverForm }: UserFormSidebarProps) => {
  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-lg border">
      <h3 className="text-lg font-medium mb-4">{isDriverForm ? "Driver" : "User"} Information</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {isDriverForm 
          ? 'Drivers are responsible for handling trips and transporting passengers.' 
          : 'Adding a new user will allow them to access the system according to their role permissions.'}
      </p>
      <div className="space-y-4">
        {isDriverForm ? (
          <>
            <div>
              <h4 className="font-medium">Driver Details</h4>
              <p className="text-sm text-muted-foreground">
                Provide accurate driver information including contact details and vehicle type.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Vehicle Assignment</h4>
              <p className="text-sm text-muted-foreground">
                Select the vehicle type the driver is authorized to operate.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Availability Status</h4>
              <p className="text-sm text-muted-foreground">
                Set the initial availability status for the driver.
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <h4 className="font-medium">Admin</h4>
              <p className="text-sm text-muted-foreground">Full access to all system features and user management.</p>
            </div>
            <div>
              <h4 className="font-medium">Driver</h4>
              <p className="text-sm text-muted-foreground">Access to bookings assigned to them and trip management.</p>
            </div>
            <div>
              <h4 className="font-medium">Dispatcher</h4>
              <p className="text-sm text-muted-foreground">Booking management and driver assignment capabilities.</p>
            </div>
            <div>
              <h4 className="font-medium">Fleet</h4>
              <p className="text-sm text-muted-foreground">Access to view bookings, assign drivers, and view reports.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
