import Map "mo:core/Map";
import List "mo:core/List";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

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

  include MixinStorage();

  var nextVideoId = 0;
  var nextChunkId = 0;

  let videoMetadata = Map.empty<VideoId, VideoMetadata>();
  let videoChunks = Map.empty<VideoId, List.List<ChunkId>>();
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
    let videoId = getNextVideoId();
    let metadata : VideoMetadata = {
      id = videoId;
      title;
      chunkCount = 0;
      isComplete = false;
      isPersistent = false; // initially not persistent
    };
    videoMetadata.add(videoId, metadata);
    videoChunks.add(videoId, List.empty<ChunkId>());
    videoId;
  };

  // Upload individual chunks
  public shared ({ caller }) func uploadChunk(videoId : VideoId, _chunk : Storage.ExternalBlob) : async Bool {
    switch (videoMetadata.get(videoId)) {
      case (null) { false };
      case (?metadata) {
        if (metadata.isComplete) {
          return false;
        };

        let chunkId = getNextChunkId();

        switch (videoChunks.get(videoId)) {
          case (null) {
            let newChunks = List.singleton<ChunkId>(chunkId);
            videoChunks.add(videoId, newChunks);
          };
          case (?chunks) {
            chunks.add(chunkId);
          };
        };

        let updatedMetadata = {
          metadata with
          chunkCount = metadata.chunkCount + 1;
        };
        videoMetadata.add(videoId, updatedMetadata);

        true;
      };
    };
  };

  // Finalize video upload and persist the video content and metadata
  public shared ({ caller }) func finalizeVideoUpload(videoId : VideoId, content : Storage.ExternalBlob) : async Bool {
    switch (videoMetadata.get(videoId)) {
      case (null) { false };
      case (?metadata) {
        if (metadata.isComplete) {
          return false;
        };

        let updatedMetadata = {
          metadata with
          isComplete = true;
          isPersistent = true; // mark as persistent
        };
        videoMetadata.add(videoId, updatedMetadata);

        let video : Video = {
          title = metadata.title;
          content;
          metadata = updatedMetadata;
        };
        videos.add(videoId, video);
        true;
      };
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
};
