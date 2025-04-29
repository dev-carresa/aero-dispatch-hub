
interface InvoiceStatusBadgeProps {
  status: string;
}

export const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  return (
    <span className={`status-badge ${
      status === 'paid' 
        ? 'status-badge-confirmed' 
        : status === 'pending'
        ? 'status-badge-pending'
        : 'status-badge-cancelled'
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
