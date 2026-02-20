import { useGetMasterVideoBlob } from '@/hooks/useQueries';
import { Loader2, AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function MasterPresentationPlayer() {
  const { data: videoUrl, isLoading, isError, error, refetch, failureCount, isFetching } = useGetMasterVideoBlob();
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [isPolling, setIsPolling] = useState(false);

  // Implement polling with exponential backoff when video is not immediately available
  useEffect(() => {
    console.log('[MasterPresentationPlayer] Component mounted/updated', {
      isLoading,
      isError,
      hasVideoUrl: !!videoUrl,
      failureCount,
      isFetching,
    });

    if (!isLoading && !isError && !videoUrl && retryAttempt < 5 && !isPolling) {
      console.log(`[MasterPresentationPlayer] Video not available, scheduling retry ${retryAttempt + 1}/5`);
      setIsPolling(true);
      
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const delay = Math.min(1000 * Math.pow(2, retryAttempt), 16000);
      console.log(`[MasterPresentationPlayer] Next retry in ${delay}ms`);
      
      const timer = setTimeout(() => {
        console.log(`[MasterPresentationPlayer] Executing retry attempt ${retryAttempt + 1}`);
        setRetryAttempt(prev => prev + 1);
        setIsPolling(false);
        refetch();
      }, delay);

      return () => {
        clearTimeout(timer);
        setIsPolling(false);
      };
    }
  }, [videoUrl, isLoading, isError, retryAttempt, refetch, isPolling, failureCount, isFetching]);

  // Reset retry count when video becomes available
  useEffect(() => {
    if (videoUrl) {
      console.log('[MasterPresentationPlayer] Video URL available, resetting retry count');
      setRetryAttempt(0);
      setIsPolling(false);
    }
  }, [videoUrl]);

  if (isLoading || isFetching) {
    const displayAttempt = failureCount > 0 ? failureCount + 1 : retryAttempt > 0 ? retryAttempt : null;
    
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          {retryAttempt > 0 
            ? `Preparing video for playback... (Attempt ${retryAttempt}/5)` 
            : 'Loading master presentation video...'}
        </p>
        {displayAttempt && (
          <p className="mt-2 text-xs text-muted-foreground">
            Retrying... (Attempt {displayAttempt})
          </p>
        )}
      </div>
    );
  }

  if (isError) {
    console.error('[MasterPresentationPlayer] Error loading master video:', error);
    
    // Determine error type for better messaging
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const isConnectionError = 
      errorMessage.includes('ERR_CONNECTION_RESET') ||
      errorMessage.includes('Failed to fetch') ||
      errorMessage.includes('NetworkError') ||
      errorMessage.includes('network') ||
      errorMessage.includes('timeout');
    
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-12 text-center">
        {isConnectionError ? (
          <WifiOff className="mb-4 h-12 w-12 text-destructive" />
        ) : (
          <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        )}
        <p className="text-sm font-medium text-destructive">
          {isConnectionError 
            ? 'Connection interrupted while loading video' 
            : 'Failed to load master presentation'}
        </p>
        <p className="mt-2 text-xs text-muted-foreground max-w-md">
          {isConnectionError 
            ? 'Connection interrupted while loading video. This is usually temporary. Please try again.'
            : errorMessage}
        </p>
        {failureCount > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Failed after {failureCount} {failureCount === 1 ? 'attempt' : 'attempts'}
          </p>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log('[MasterPresentationPlayer] Manual retry triggered');
            setRetryAttempt(0);
            setIsPolling(false);
            refetch();
          }}
          className="mt-4 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (!videoUrl) {
    // Show loading state while polling
    if (retryAttempt > 0 && retryAttempt < 5) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Preparing video for playback... (Attempt {retryAttempt}/5)
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            The video is being finalized. Please wait...
          </p>
        </div>
      );
    }
    
    // Max retries reached
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-12 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <p className="text-sm font-medium text-destructive">Video not available</p>
        <p className="mt-2 text-xs text-muted-foreground max-w-md">
          The video was uploaded but cannot be retrieved after multiple attempts. Please try uploading the video again or refresh the page.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log('[MasterPresentationPlayer] Manual retry after max attempts');
            setRetryAttempt(0);
            setIsPolling(false);
            refetch();
          }}
          className="mt-4 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  console.log('[MasterPresentationPlayer] Rendering video player with URL:', videoUrl);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border bg-black shadow-2xl">
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto object-contain"
        style={{ maxHeight: '70vh' }}
        onLoadStart={() => console.log('[MasterPresentationPlayer] Video load started')}
        onLoadedData={() => console.log('[MasterPresentationPlayer] Video data loaded')}
        onCanPlay={() => console.log('[MasterPresentationPlayer] Video can play')}
        onError={(e) => console.error('[MasterPresentationPlayer] Video element error:', e)}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
