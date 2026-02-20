# Specification

## Summary
**Goal:** Fix backend video finalization and persistence after chunked upload to ensure videos are saved and immediately retrievable.

**Planned changes:**
- Fix backend finalizeVideoUpload function to properly persist video metadata to stable storage after all chunks are received
- Add explicit error handling and logging in finalizeVideoUpload to catch and report storage failures, memory allocation issues, or serialization errors
- Add pre-finalization validation to check available stable memory capacity before attempting to store the video
- Update MasterVideoUploader component to handle finalization failure responses with specific error messages and retry option
- Add 30-second timeout mechanism in MasterVideoUploader to detect stuck finalization and display timeout error with retry option
- Update Home.tsx conditional rendering to verify video metadata exists after upload before switching from uploader to player UI

**User-visible outcome:** After uploading a video, the upload completes successfully with the video immediately available for playback. If finalization fails, users see specific error messages and can retry the upload instead of being stuck at "Finalizing upload..." indefinitely.
