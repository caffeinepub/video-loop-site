import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUploadMasterVideo } from '@/hooks/useQueries';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB limit
const POST_UPLOAD_DELAY = 2500; // 2.5 second delay before triggering callback
const FINALIZATION_TIMEOUT = 30000; // 30 seconds timeout for finalization

interface MasterVideoUploaderProps {
  onUploadComplete?: () => void;
  persistenceError?: string;
}

export function MasterVideoUploader({ onUploadComplete, persistenceError }: MasterVideoUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const finalizationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const uploadMutation = useUploadMasterVideo();

  // Clear finalization timer on unmount
  useEffect(() => {
    return () => {
      if (finalizationTimerRef.current) {
        clearTimeout(finalizationTimerRef.current);
      }
    };
  }, []);

  // Handle external persistence error from parent
  useEffect(() => {
    if (persistenceError) {
      setErrorMessage(persistenceError);
      setIsUploading(false);
      setIsFinalizing(false);
      setUploadSuccess(false);
      setShowSuccessMessage(false);
    }
  }, [persistenceError]);

  const resetUploadState = () => {
    setIsUploading(false);
    setIsFinalizing(false);
    setUploadProgress(0);
    setUploadSuccess(false);
    setShowSuccessMessage(false);
    setCurrentChunk(0);
    setTotalChunks(0);
    setErrorMessage(null);
    
    // Clear finalization timer
    if (finalizationTimerRef.current) {
      clearTimeout(finalizationTimerRef.current);
      finalizationTimerRef.current = null;
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Invalid file type. Please select a video file.');
      return;
    }

    // Validate MP4 format specifically
    if (file.type !== 'video/mp4' && !file.name.toLowerCase().endsWith('.mp4')) {
      toast.error('Please select an MP4 video file for best compatibility.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit. Please select a smaller file.`);
      return;
    }

    if (file.size === 0) {
      toast.error('The selected file is empty. Please select a valid video file.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadSuccess(false);
      setShowSuccessMessage(false);
      setCurrentChunk(0);
      setTotalChunks(0);
      setErrorMessage(null);
      setIsFinalizing(false);

      const uploadStartTime = performance.now();
      console.log('[MasterVideoUploader] Starting file upload at', new Date().toISOString(), {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Read file as ArrayBuffer
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result instanceof ArrayBuffer) {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file as ArrayBuffer'));
          }
        };
        reader.onerror = () => reject(new Error('File reading failed'));
        reader.readAsArrayBuffer(file);
      });

      // Convert to Uint8Array
      const uint8Array = new Uint8Array(arrayBuffer);
      
      if (uint8Array.length === 0) {
        throw new Error('File conversion resulted in empty data');
      }

      console.log('[MasterVideoUploader] File read successfully, starting chunked upload...');

      // Calculate total chunks for display
      const CHUNK_SIZE = 1.5 * 1024 * 1024; // Match the chunk size in useQueries
      const chunks = Math.ceil(uint8Array.length / CHUNK_SIZE);
      setTotalChunks(chunks);

      // Upload with progress tracking
      await uploadMutation.mutateAsync({
        videoData: uint8Array,
        onProgress: (percentage) => {
          setUploadProgress(percentage);
          
          // Detect when finalization starts (progress >= 95%)
          if (percentage >= 95 && !isFinalizing) {
            console.log('[MasterVideoUploader] Finalization started, setting timeout...');
            setIsFinalizing(true);
            
            // Start finalization timeout
            finalizationTimerRef.current = setTimeout(() => {
              console.error('[MasterVideoUploader] Finalization timeout after 30 seconds');
              setErrorMessage('Upload finalization timed out after 30 seconds. The backend may be experiencing issues. Please try uploading again.');
              setIsUploading(false);
              setIsFinalizing(false);
              setUploadProgress(0);
              setUploadSuccess(false);
              setShowSuccessMessage(false);
              
              toast.error('Finalization timeout', {
                description: 'The upload took too long to complete. Please try again.',
                duration: 5000,
              });
            }, FINALIZATION_TIMEOUT);
          }
          
          // Calculate current chunk based on percentage
          const currentChunkEstimate = Math.floor((percentage / 95) * chunks);
          setCurrentChunk(Math.min(currentChunkEstimate, chunks));
        },
      });
      
      // Clear finalization timer on success
      if (finalizationTimerRef.current) {
        clearTimeout(finalizationTimerRef.current);
        finalizationTimerRef.current = null;
      }
      
      const uploadCompleteTime = performance.now();
      console.log(`[MasterVideoUploader] Upload completed at ${new Date().toISOString()} (${((uploadCompleteTime - uploadStartTime) / 1000).toFixed(2)}s)`);
      
      // Success - show success message immediately
      setUploadProgress(100);
      setUploadSuccess(true);
      setShowSuccessMessage(true);
      setIsUploading(false);
      setIsFinalizing(false);
      
      // Show success toast
      toast.success('Video uploaded successfully!', {
        duration: 3000,
        description: 'Your video is now being prepared for playback.',
      });
      
      console.log(`[MasterVideoUploader] Waiting ${POST_UPLOAD_DELAY}ms before triggering callback...`);
      
      // Wait POST_UPLOAD_DELAY before triggering parent callback
      setTimeout(() => {
        const callbackTime = performance.now();
        console.log(`[MasterVideoUploader] Triggering onUploadComplete callback at ${new Date().toISOString()} (${((callbackTime - uploadStartTime) / 1000).toFixed(2)}s total)`);
        
        // Notify parent component that upload is complete
        // This will trigger the video retrieval
        onUploadComplete?.();
      }, POST_UPLOAD_DELAY);
    } catch (error) {
      console.error('[MasterVideoUploader] Upload error:', error);
      
      // Clear finalization timer on error
      if (finalizationTimerRef.current) {
        clearTimeout(finalizationTimerRef.current);
        finalizationTimerRef.current = null;
      }
      
      // Provide specific error messages
      let errorMsg = 'Failed to upload video. Please try again.';
      
      if (error instanceof Error) {
        // Log full error details for debugging
        console.error('[MasterVideoUploader] Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });

        if (error.message.includes('not initialized')) {
          errorMsg = 'Backend connection not ready. Please refresh the page and try again.';
        } else if (error.message.includes('finalize')) {
          errorMsg = 'Failed to finalize video upload. The backend may be experiencing storage issues. Please try again.';
        } else if (error.message.includes('replica')) {
          errorMsg = error.message; // Use the detailed replica error message
        } else if (error.message.includes('chunk')) {
          errorMsg = error.message; // Use the detailed chunk error message
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMsg = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('size') || error.message.includes('limit')) {
          errorMsg = 'File is too large. Please select a smaller video file.';
        } else if (error.message.includes('capacity') || error.message.includes('memory')) {
          errorMsg = 'Canister storage capacity reached. Please contact support.';
        } else if (error.message) {
          errorMsg = error.message;
        }
      }
      
      setErrorMessage(errorMsg);
      
      toast.error(errorMsg, {
        duration: 5000,
      });
      
      setIsUploading(false);
      setIsFinalizing(false);
      setUploadProgress(0);
      setUploadSuccess(false);
      setShowSuccessMessage(false);
      setCurrentChunk(0);
      setTotalChunks(0);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="master-video" className="text-sm font-medium">
          Select Master Presentation Video
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="master-video"
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/*"
            onChange={handleFileUpload}
            disabled={isUploading || showSuccessMessage}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || showSuccessMessage}
            size="sm"
            className="gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Browse
              </>
            )}
          </Button>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {isFinalizing ? 'Finalizing upload...' : 'Upload Progress'}
              {totalChunks > 0 && !isFinalizing && (
                <span className="ml-2 text-xs">
                  (Chunk {currentChunk}/{totalChunks})
                </span>
              )}
            </span>
            <span className="font-medium">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {isFinalizing 
              ? 'Finalizing video upload. This may take a moment...'
              : 'Uploading video in chunks for reliability. Please do not close this page.'}
          </p>
        </div>
      )}

      {showSuccessMessage && (
        <div className="flex items-center gap-2 rounded-md bg-primary/10 p-4 text-sm text-primary border border-primary/20">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Upload Complete!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your video has been successfully uploaded and is being prepared for playback.
            </p>
          </div>
        </div>
      )}

      {errorMessage && !isUploading && !showSuccessMessage && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Upload Failed</p>
              <p className="text-xs mt-1">{errorMessage}</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={resetUploadState}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Retry Upload
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Upload your master presentation video (MP4 format recommended, max {MAX_FILE_SIZE / (1024 * 1024)}MB). This will replace the current video in the Master Presentation section.
      </p>
    </div>
  );
}
