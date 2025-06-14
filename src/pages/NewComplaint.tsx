
import { ComplaintForm } from "@/components/complaints/ComplaintForm";

const NewComplaint = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Complaint</h1>
        <p className="text-muted-foreground">Report issues with bookings or service and attach supporting documents</p>
      </div>
      
      <div className="bg-white rounded-md border p-6">
        <ComplaintForm />
      </div>
    </div>
  );
};

export default NewComplaint;
