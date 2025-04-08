
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CircleDashed } from "lucide-react";

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={`flex justify-center items-center ${className || ""}`}>
      <CircleDashed className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
};

export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner />
    </div>
  );
};

export const TutorCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-2">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div>
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pb-2">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-9 w-full" />
    </CardFooter>
  </Card>
);

export const NoResultsMessage = ({ message }: { message: string }) => (
  <Card className="bg-muted/50">
    <CardContent className="py-8 text-center">
      <p className="text-lg mb-2">No results found</p>
      <p className="text-muted-foreground">{message}</p>
    </CardContent>
  </Card>
);

export const ErrorDisplay = ({ message, retry }: { message: string, retry?: () => void }) => (
  <Card className="bg-red-50 border-red-200">
    <CardContent className="py-6 text-center">
      <p className="text-red-600 mb-2">Error</p>
      <p className="text-muted-foreground mb-4">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      )}
    </CardContent>
  </Card>
);
