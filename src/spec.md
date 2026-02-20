# Specification

## Summary
**Goal:** Hide video functionality in the Master Presentation section and replace it with a static thematic image.

**Planned changes:**
- Comment out MasterVideoUploader and MasterPresentationPlayer components in the Master Presentation section
- Comment out backend video endpoints (initVideo, uploadChunk, finalizeVideo, getMasterVideo, getVideoMetadata)
- Display a static forensic anthropology themed hero image in place of video components

**User-visible outcome:** The Master Presentation section displays a static forensic anthropology themed image instead of video upload/playback interface, while maintaining all other sections and functionality.
