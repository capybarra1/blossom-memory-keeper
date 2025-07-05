
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn(
      "h-full flex flex-col items-center justify-center p-6 text-center",
      className
    )}>
      <div className="w-16 h-16 bg-plantDiary-purple/30 rounded-full flex items-center justify-center mb-4">
        {icon || <Plus className="h-8 w-8 text-foreground/40" />}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-sm text-foreground/60 max-w-xs mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
