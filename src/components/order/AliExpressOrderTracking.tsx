import { useState, useEffect } from "react";
import { Package, Truck, MapPin, CheckCircle2, Clock, Box, X, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TrackingEvent {
  status: string;
  location?: string;
  description?: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
}

interface AliExpressOrderTrackingProps {
  orderId: string;
  orderNumber: string;
  currentStatus: string;
  trackingHistory: TrackingEvent[];
  estimatedDelivery?: string;
  shippingAddress?: string;
}

const ORDER_STAGES = [
  { key: "pending", label: "Order Placed", icon: Package, description: "Your order has been received" },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2, description: "Order confirmed by seller" },
  { key: "processing", label: "Processing", icon: Box, description: "Preparing for shipment" },
  { key: "shipped", label: "Shipped", icon: Truck, description: "On the way to you" },
  { key: "in_transit", label: "In Transit", icon: MapPin, description: "In transit to your location" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck, description: "With delivery agent" },
  { key: "delivered", label: "Delivered", icon: CheckCircle2, description: "Order delivered!" },
];

export function AliExpressOrderTracking({
  orderId,
  orderNumber,
  currentStatus,
  trackingHistory,
  estimatedDelivery,
  shippingAddress,
}: AliExpressOrderTrackingProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const getCurrentStageIndex = () => {
    const statusMap: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      processing: 2,
      shipped: 3,
      in_transit: 4,
      out_for_delivery: 5,
      delivered: 6,
      cancelled: -1,
    };
    return statusMap[currentStatus.toLowerCase()] ?? 0;
  };

  const currentStageIndex = getCurrentStageIndex();
  const isCancelled = currentStatus.toLowerCase() === "cancelled";

  useEffect(() => {
    // Animate progress bar
    const targetProgress = isCancelled ? 0 : ((currentStageIndex + 1) / ORDER_STAGES.length) * 100;
    const timer = setTimeout(() => setProgress(targetProgress), 300);
    return () => clearTimeout(timer);
  }, [currentStageIndex, isCancelled]);

  const getStatusColor = (index: number) => {
    if (isCancelled) return "text-destructive";
    if (index < currentStageIndex) return "text-primary";
    if (index === currentStageIndex) return "text-primary";
    return "text-muted-foreground/50";
  };

  const getStatusBg = (index: number) => {
    if (isCancelled) return "bg-destructive/10";
    if (index <= currentStageIndex) return "bg-primary";
    return "bg-muted";
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Order #{orderNumber}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track your order status in real-time
              </p>
            </div>
            <Badge 
              variant={isCancelled ? "destructive" : "default"}
              className={cn(
                "text-sm px-3 py-1",
                !isCancelled && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {isCancelled ? (
                <>
                  <X className="h-3 w-3 mr-1" />
                  Cancelled
                </>
              ) : (
                ORDER_STAGES[currentStageIndex]?.label || currentStatus
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Progress</span>
              <span className="font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Estimated Delivery */}
          {estimatedDelivery && !isCancelled && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">{estimatedDelivery}</p>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Delivery Address</p>
                <p className="text-sm text-muted-foreground">{shippingAddress}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <div className="flex justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
                <div 
                  className="h-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${isCancelled ? 0 : (currentStageIndex / (ORDER_STAGES.length - 1)) * 100}%` }}
                />
              </div>

              {ORDER_STAGES.map((stage, index) => {
                const Icon = stage.icon;
                const isCompleted = index <= currentStageIndex && !isCancelled;
                const isCurrent = index === currentStageIndex && !isCancelled;

                return (
                  <div key={stage.key} className="flex flex-col items-center relative z-10 flex-1">
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                        getStatusBg(index),
                        isCompleted ? "text-primary-foreground" : "text-muted-foreground",
                        isCurrent && "ring-4 ring-primary/20 animate-pulse"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className={cn(
                      "text-xs mt-2 font-medium text-center",
                      getStatusColor(index)
                    )}>
                      {stage.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-4">
            {ORDER_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isCompleted = index <= currentStageIndex && !isCancelled;
              const isCurrent = index === currentStageIndex && !isCancelled;

              return (
                <div key={stage.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div 
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        getStatusBg(index),
                        isCompleted ? "text-primary-foreground" : "text-muted-foreground",
                        isCurrent && "ring-2 ring-primary/30"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    {index < ORDER_STAGES.length - 1 && (
                      <div className={cn(
                        "w-0.5 h-8 mt-1",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className={cn(
                      "text-sm font-medium",
                      getStatusColor(index)
                    )}>
                      {stage.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tracking History */}
      {trackingHistory.length > 0 && (
        <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Tracking History</CardTitle>
                  {isHistoryOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {trackingHistory.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          index === 0 ? "bg-primary" : "bg-muted"
                        )} />
                        {index < trackingHistory.length - 1 && (
                          <div className="w-0.5 flex-1 bg-muted" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <p className={cn(
                            "text-sm font-medium",
                            index === 0 ? "text-primary" : "text-foreground"
                          )}>
                            {event.status}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(event.timestamp), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        {event.location && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </p>
                        )}
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
}
