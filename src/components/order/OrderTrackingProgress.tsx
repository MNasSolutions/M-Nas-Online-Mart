import { CheckCircle, Package, Truck, MapPin, Home, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatus {
  status: string;
  location?: string;
  description?: string;
  created_at: string;
}

interface OrderTrackingProgressProps {
  currentStatus: string;
  trackingHistory?: OrderStatus[];
}

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock, description: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Order confirmed by seller' },
  { key: 'processing', label: 'Processing', icon: Package, description: 'Your order is being prepared' },
  { key: 'shipped', label: 'Shipped', icon: Truck, description: 'Order has been shipped' },
  { key: 'delivered', label: 'Delivered', icon: Home, description: 'Order delivered successfully' },
];

export default function OrderTrackingProgress({ currentStatus, trackingHistory = [] }: OrderTrackingProgressProps) {
  const getCurrentStepIndex = () => {
    const index = ORDER_STEPS.findIndex(step => step.key === currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full">
          {/* Progress Fill */}
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
            style={{ width: `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {ORDER_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                    isCompleted 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                      : "bg-muted text-muted-foreground",
                    isCurrent && "ring-4 ring-primary/20 scale-110"
                  )}
                >
                  <StepIcon className={cn("w-5 h-5", isCurrent && "animate-pulse")} />
                </div>
                <div className="mt-3 text-center">
                  <p className={cn(
                    "font-medium text-sm",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[100px]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracking History */}
      {trackingHistory.length > 0 && (
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="font-semibold mb-4">Tracking History</h3>
          <div className="space-y-4">
            {trackingHistory.map((event, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    index === 0 ? "bg-primary" : "bg-muted-foreground/50"
                  )} />
                  {index < trackingHistory.length - 1 && (
                    <div className="w-0.5 h-12 bg-muted" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "font-medium capitalize",
                      index === 0 ? "text-primary" : "text-foreground"
                    )}>
                      {event.status.replace('_', ' ')}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {event.location}
                    </div>
                  )}
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Notice:</strong> Orders are typically processed within 1–2 business days. 
          You will receive a confirmation email and WhatsApp message once your order ships with tracking information.
        </p>
      </div>
    </div>
  );
}
