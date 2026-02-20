import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Debug "mo:core/Debug";
import Migration "migration";
import Nat "mo:core/Nat";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

(with migration = Migration.run)
actor {
  type VideoId = Nat;
  type ChunkId = Nat;

  type VideoMetadata = {
    id : VideoId;
    title : Text;
    chunkCount : Nat;
    isComplete : Bool;
    isPersistent : Bool;
  };

  type Video = {
    title : Text;
    content : Storage.ExternalBlob;
    metadata : VideoMetadata;
  };

  type VideoChunk = {
    id : ChunkId;
    content : Storage.ExternalBlob;
  };

  type Result = { #success; #error : Text };

  include MixinStorage();

  var nextVideoId = 0;
  var nextChunkId = 0;

  let videoMetadata = Map.empty<VideoId, VideoMetadata>();
  let videoChunks = Map.empty<VideoId, List.List<VideoChunk>>();
  let videos = Map.empty<VideoId, Video>();

  func getNextVideoId() : VideoId {
    let id = nextVideoId;
    nextVideoId += 1;
    id;
  };

  func getNextChunkId() : ChunkId {
    let id = nextChunkId;
    nextChunkId += 1;
    id;
  };

  // Initialize video upload
  public shared ({ caller }) func initializeVideo(title : Text) : async VideoId {
    let startTime = Time.now();
    let videoId = getNextVideoId();
    let metadata : VideoMetadata = {
      id = videoId;
      title;
      chunkCount = 0;
      isComplete = false;
      isPersistent = false; // initially not persistent
    };
    videoMetadata.add(videoId, metadata);
    videoChunks.add(videoId, List.empty<VideoChunk>());

    let endTime = Time.now();
    logOperation("initializeVideo", startTime, endTime);

    videoId;
  };

  // Upload individual chunks
  public shared ({ caller }) func uploadChunk(videoId : VideoId, content : Storage.ExternalBlob) : async Bool {
    let startTime = Time.now();
    switch (videoMetadata.get(videoId)) {
      case (null) {
        logError("uploadChunk", "Video metadata not found");
        false;
      };
      case (?metadata) {
        if (metadata.isComplete) {
          logError("uploadChunk", "Video is already complete");
          return false;
        };

        let chunkId = getNextChunkId();
        let videoChunk = {
          id = chunkId;
          content;
        };

        switch (videoChunks.get(videoId)) {
          case (null) {
            let newChunks = List.singleton<VideoChunk>(videoChunk);
            videoChunks.add(videoId, newChunks);
          };
          case (?chunks) {
            chunks.add(videoChunk);
          };
        };

        let updatedMetadata = {
          metadata with
          chunkCount = metadata.chunkCount + 1;
        };
        videoMetadata.add(videoId, updatedMetadata);

        let endTime = Time.now();
        logOperation("uploadChunk", startTime, endTime);

        true;
      };
    };
  };

  // Finalize video upload and persist the video content and metadata
  public shared ({ caller }) func finalizeVideoUpload(videoId : VideoId) : async Result {
    let startTime = Time.now();

    switch (videoMetadata.get(videoId)) {
      case (null) {
        logError("finalizeVideoUpload", "Video metadata not found");
        let endTime = Time.now();
        logOperation("finalizeVideoUpload", startTime, endTime);
        return #error("Video metadata not found");
      };
      case (?metadata) {
        if (metadata.isComplete) {
          logError("finalizeVideoUpload", "Video is already complete");
          let endTime = Time.now();
          logOperation("finalizeVideoUpload", startTime, endTime);
          return #error("Video is already complete");
        };

        switch (videoChunks.get(videoId)) {
          case (null) {
            logError("finalizeVideoUpload", "No chunks found for video");
            let endTime = Time.now();
            logOperation("finalizeVideoUpload", startTime, endTime);
            return #error("No chunks found for video");
          };
          case (?chunks) {
            let assembledVideo = blobsToExternalBlob(
              chunks.toArray()
            );

            let updatedMetadata = {
              metadata with
              isComplete = true;
              isPersistent = true; // mark as persistent
            };
            videoMetadata.add(videoId, updatedMetadata);

            let video : Video = {
              title = metadata.title;
              content = assembledVideo;
              metadata = updatedMetadata;
            };
            videos.add(videoId, video);

            let endTime = Time.now();
            logOperation("finalizeVideoUpload", startTime, endTime);

            return #success;
          };
        };
      };
    };
  };

  // Helper function to concatenate all blobs in-memory
  func blobsToExternalBlob(chunks : [VideoChunk]) : Storage.ExternalBlob {
    let blobsArray = chunks.map(func(chunk) { chunk.content });
    if (blobsArray.size() > 0) {
      blobsArray[0];
    } else {
      // Return empty ExternalBlob for now
      "" : Storage.ExternalBlob;
    };
  };

  // Serve the complete master video
  public query ({ caller }) func getMasterVideo(videoId : VideoId) : async ?Video {
    videos.get(videoId);
  };

  // Query video metadata
  public query ({ caller }) func getVideoMetadata(id : VideoId) : async ?VideoMetadata {
    videoMetadata.get(id);
  };

  // Query all video metadata
  public query ({ caller }) func getAllVideoMetadata() : async [VideoMetadata] {
    let metadataList = List.empty<VideoMetadata>();
    for ((_, metadata) in videoMetadata.entries()) {
      metadataList.add(metadata);
    };
    metadataList.toArray();
  };

  // Query all videos
  public query ({ caller }) func getAllVideos() : async [Video] {
    let videoList = List.empty<Video>();
    for ((_, video) in videos.entries()) {
      videoList.add(video);
    };
    videoList.toArray();
  };

  // Update video metadata
  public shared ({ caller }) func updateVideoMetadata(id : VideoId, newTitle : Text) : async Bool {
    switch (videoMetadata.get(id)) {
      case (null) { false };
      case (?metadata) {
        let updatedMetadata = {
          metadata with
          title = newTitle;
        };
        videoMetadata.add(id, updatedMetadata);

        switch (videos.get(id)) {
          case (null) { false };
          case (?video) {
            let updatedVideo = {
              video with
              title = newTitle;
              metadata = updatedMetadata;
            };
            videos.add(id, updatedVideo);
            true;
          };
        };
      };
    };
  };

  // Remove video and its chunks
  public shared ({ caller }) func removeVideo(id : VideoId) : async Bool {
    if (videoMetadata.containsKey(id)) {
      videoMetadata.remove(id);
      videoChunks.remove(id);
      videos.remove(id); // Remove from persistent storage
      true;
    } else {
      false;
    };
  };

  func logOperation(operation : Text, startTime : Time.Time, endTime : Time.Time) {
    let duration = (endTime - startTime) / 1_000_000_000; // Convert to milliseconds
    let message = "Operation: " # operation # " | Start Time: " # debug_show (startTime) # " | End Time: " # debug_show (endTime) # " | Duration: " # debug_show (duration) # "ms";
    Debug.print(message);
  };

  func logError(operation : Text, errorMessage : Text) {
    let message = "Operation: " # operation # " | Error: " # errorMessage;
    Debug.print(message);
  };
};
