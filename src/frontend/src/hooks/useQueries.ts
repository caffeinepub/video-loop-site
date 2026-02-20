import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob, VideoMetadata, Video } from '@/backend';

const CHUNK_SIZE = 1.5 * 1024 * 1024; // 1.5 MB chunks for safe upload
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const POST_UPLOAD_DELAY = 2500; // 2.5 second delay after upload completion

// Helper function to sleep for retry delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useGetAllVideoMetadata() {
  const { actor, isFetching } = useActor();

  return useQuery<VideoMetadata[]>({
    queryKey: ['videoMetadata'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideoMetadata();
    },
    enabled: !!actor && !isFetching,
  });
}

// Video functionality hidden - preserved for future use
// export function useGetMasterVideo() {
//   const { actor, isFetching } = useActor();
//
//   return useQuery<VideoMetadata | null>({
//     queryKey: ['masterVideo'],
//     queryFn: async () => {
//       if (!actor) return null;
//       try {
//         console.log('[useGetMasterVideo] Fetching master video metadata...');
//         // Use video ID 0 as the master video by convention
//         const video = await actor.getVideoMetadata(BigInt(0));
//         console.log('[useGetMasterVideo] Metadata fetched:', video);
//         return video || null;
//       } catch (error) {
//         console.error('[useGetMasterVideo] Error fetching master video:', error);
//         return null;
//       }
//     },
//     enabled: !!actor && !isFetching,
//     refetchOnMount: true,
//     staleTime: 0, // Always refetch when query is invalidated
//   });
// }

// Stub function to prevent import errors - video functionality hidden
export function useGetMasterVideo() {
  return useQuery<VideoMetadata | null>({
    queryKey: ['masterVideo'],
    queryFn: async () => null,
    enabled: false,
  });
}

// Video functionality hidden - preserved for future use
// export function useGetMasterVideoBlob() {
//   const { actor, isFetching } = useActor();
//
//   return useQuery<string | null>({
//     queryKey: ['masterVideoBlob'],
//     queryFn: async () => {
//       if (!actor) {
//         console.log('[useGetMasterVideoBlob] Actor not initialized');
//         return null;
//       }
//       
//       try {
//         console.log('[useGetMasterVideoBlob] Fetching master video blob from backend...');
//         const startTime = performance.now();
//         
//         // Fetch the complete video from backend
//         const video: Video | null = await actor.getMasterVideo(BigInt(0));
//         
//         if (!video) {
//           console.log('[useGetMasterVideoBlob] No video found in backend');
//           return null;
//         }
//
//         if (!video.content) {
//           console.log('[useGetMasterVideoBlob] Video exists but content is null');
//           return null;
//         }
//
//         console.log('[useGetMasterVideoBlob] Video fetched, converting to blob URL...');
//         
//         // Get the direct URL from ExternalBlob
//         const videoUrl = video.content.getDirectURL();
//         
//         const endTime = performance.now();
//         console.log(`[useGetMasterVideoBlob] Blob URL created successfully in ${(endTime - startTime).toFixed(2)}ms:`, videoUrl);
//         
//         return videoUrl;
//       } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : String(error);
//         console.error('[useGetMasterVideoBlob] Error fetching master video blob:', {
//           error: errorMessage,
//           stack: error instanceof Error ? error.stack : undefined,
//         });
//         throw error;
//       }
//     },
//     enabled: !!actor && !isFetching,
//     refetchOnMount: true,
//     staleTime: 0, // Always refetch when query is invalidated
//     gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
//     retry: (failureCount, error) => {
//       console.log(`[useGetMasterVideoBlob] Retry attempt ${failureCount + 1}/5`);
//       
//       // Retry up to 5 times for network errors
//       if (failureCount >= 5) {
//         console.log('[useGetMasterVideoBlob] Max retries reached');
//         return false;
//       }
//       
//       // Check if it's a network error that might be temporary
//       const errorMessage = error instanceof Error ? error.message : String(error);
//       const isNetworkError = 
//         errorMessage.includes('ERR_CONNECTION_RESET') ||
//         errorMessage.includes('Failed to fetch') ||
//         errorMessage.includes('NetworkError') ||
//         errorMessage.includes('network') ||
//         errorMessage.includes('timeout');
//       
//       if (isNetworkError) {
//         console.log('[useGetMasterVideoBlob] Network error detected, will retry');
//       }
//       
//       return isNetworkError;
//     },
//     retryDelay: (attemptIndex) => {
//       // Exponential backoff: 1s, 2s, 4s, 8s, 16s
//       const delay = Math.min(1000 * Math.pow(2, attemptIndex), 16000);
//       console.log(`[useGetMasterVideoBlob] Next retry in ${delay}ms`);
//       return delay;
//     },
//   });
// }

// Stub function to prevent import errors - video functionality hidden
export function useGetMasterVideoBlob() {
  return useQuery<string | null>({
    queryKey: ['masterVideoBlob'],
    queryFn: async () => null,
    enabled: false,
  });
}

// Video functionality hidden - preserved for future use
// export function useUploadMasterVideo() {
//   const { actor } = useActor();
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: async ({ 
//       videoData, 
//       onProgress 
//     }: { 
//       videoData: Uint8Array; 
//       onProgress?: (percentage: number) => void 
//     }) => {
//       if (!actor) {
//         throw new Error('Backend connection not initialized. Please refresh the page.');
//       }
//
//       try {
//         const uploadStartTime = performance.now();
//         console.log('[useUploadMasterVideo] Starting upload at', new Date().toISOString());
//         
//         // Step 1: Initialize video upload
//         console.log('[useUploadMasterVideo] Initializing video upload...');
//         const videoId = await actor.initializeVideo('Master Presentation');
//         console.log('[useUploadMasterVideo] Video initialized with ID:', videoId);
//
//         // Step 2: Upload chunks
//         const totalChunks = Math.ceil(videoData.length / CHUNK_SIZE);
//         console.log(`[useUploadMasterVideo] Uploading ${totalChunks} chunks (${videoData.length} bytes total)...`);
//
//         for (let i = 0; i < totalChunks; i++) {
//           const start = i * CHUNK_SIZE;
//           const end = Math.min(start + CHUNK_SIZE, videoData.length);
//           const chunk = videoData.slice(start, end);
//
//           console.log(`[useUploadMasterVideo] Uploading chunk ${i + 1}/${totalChunks} (${chunk.length} bytes)`);
//
//           // Create ExternalBlob from chunk - ensure proper ArrayBuffer type
//           const chunkArrayBuffer = new ArrayBuffer(chunk.length);
//           const chunkView = new Uint8Array(chunkArrayBuffer);
//           chunkView.set(chunk);
//           const chunkBlob = ExternalBlob.fromBytes(chunkView);
//
//           // Retry logic for chunk upload
//           let retries = 0;
//           let success = false;
//
//           while (retries < MAX_RETRIES && !success) {
//             try {
//               const result = await actor.uploadChunk(videoId, chunkBlob);
//               
//               if (!result) {
//                 throw new Error(`Chunk ${i + 1} upload rejected by backend`);
//               }
//
//               success = true;
//               
//               // Update progress (0-95% for upload, 95-100% for finalization)
//               const progress = ((i + 1) / totalChunks) * 95;
//               onProgress?.(progress);
//               
//               console.log(`[useUploadMasterVideo] Chunk ${i + 1}/${totalChunks} uploaded successfully (${progress.toFixed(1)}%)`);
//             } catch (error) {
//               retries++;
//               console.error(`[useUploadMasterVideo] Chunk ${i + 1} upload attempt ${retries} failed:`, error);
//               
//               if (retries >= MAX_RETRIES) {
//                 throw new Error(
//                   `Failed to upload chunk ${i + 1} after ${MAX_RETRIES} attempts. ${
//                     error instanceof Error ? error.message : 'Unknown error'
//                   }`
//                 );
//               }
//               
//               // Wait before retrying
//               await sleep(RETRY_DELAY_MS * retries);
//             }
//           }
//         }
//
//         // Step 3: Finalize upload
//         console.log('[useUploadMasterVideo] All chunks uploaded, finalizing...');
//         onProgress?.(97);
//         
//         const finalizeResult = await actor.finalizeVideoUpload(videoId);
//         
//         if (finalizeResult.__kind__ === 'error') {
//           throw new Error(`Failed to finalize video upload: ${finalizeResult.error}`);
//         }
//
//         const uploadEndTime = performance.now();
//         console.log(`[useUploadMasterVideo] Video upload finalized successfully in ${((uploadEndTime - uploadStartTime) / 1000).toFixed(2)}s`);
//         onProgress?.(100);
//
//         return videoId;
//       } catch (error) {
//         console.error('[useUploadMasterVideo] Upload error:', error);
//         throw error;
//       }
//     },
//     onSuccess: async () => {
//       console.log('[useUploadMasterVideo] Upload successful, waiting before invalidating queries...');
//       
//       // Wait for POST_UPLOAD_DELAY before invalidating queries
//       await sleep(POST_UPLOAD_DELAY);
//       
//       console.log('[useUploadMasterVideo] Invalidating queries at', new Date().toISOString());
//       
//       // Invalidate queries to refresh the UI
//       queryClient.invalidateQueries({ queryKey: ['masterVideo'] });
//       queryClient.invalidateQueries({ queryKey: ['masterVideoBlob'] });
//       queryClient.invalidateQueries({ queryKey: ['videoMetadata'] });
//       
//       console.log('[useUploadMasterVideo] Queries invalidated');
//     },
//   });
// }

// Stub function to prevent import errors - video functionality hidden
export function useUploadMasterVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      videoData, 
      onProgress 
    }: { 
      videoData: Uint8Array; 
      onProgress?: (percentage: number) => void 
    }) => {
      throw new Error('Video upload functionality is currently disabled');
    },
  });
}
