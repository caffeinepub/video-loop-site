import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type VideoId = Nat;
  type ChunkId = Nat;

  // Old type alias from previous deployment
  type OldVideoChunks = Map.Map<VideoId, List.List<ChunkId>>;

  // New VideoChunk type used in current deployment
  type VideoChunk = {
    id : ChunkId;
    content : Storage.ExternalBlob;
  };

  // New videoChunks type definition for current version
  type NewVideoChunks = Map.Map<VideoId, List.List<VideoChunk>>;

  // Actor state type from old deployment (using OldVideoChunks)
  type OldActor = {
    nextVideoId : Nat;
    nextChunkId : Nat;
    videoChunks : OldVideoChunks;
  };

  // Actor state type for new deployment (using NewVideoChunks)
  type NewActor = {
    nextVideoId : Nat;
    nextChunkId : Nat;
    videoChunks : NewVideoChunks;
  };

  // Migration function to transform old actor state to new format
  public func run(old : OldActor) : NewActor {
    let newVideoChunks = old.videoChunks.map<VideoId, List.List<ChunkId>, List.List<VideoChunk>>(
      func(_videoId, oldChunks) {
        oldChunks.map<ChunkId, VideoChunk>(
          func(chunkId) {
            // Convert old ChunkId entry to new VideoChunk record
            {
              id = chunkId;
              content = "" : Storage.ExternalBlob; // Placeholder as old data lacks this content
            };
          }
        );
      }
    );
    { old with videoChunks = newVideoChunks };
  };
};
