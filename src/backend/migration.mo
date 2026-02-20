import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type OldVideoId = Nat;
  type OldChunkId = Nat;

  type OldMetadata = {
    id : OldVideoId;
    title : Text;
    chunkCount : Nat;
    isComplete : Bool;
  };

  type OldVideo = {
    title : Text;
    content : Storage.ExternalBlob;
    metadata : OldMetadata;
  };

  type OldActor = {
    nextVideoId : OldVideoId;
    nextChunkId : OldChunkId;
    videoMetadata : Map.Map<OldVideoId, OldMetadata>;
    videoChunks : Map.Map<OldVideoId, List.List<OldChunkId>>;
    videos : Map.Map<OldVideoId, OldVideo>;
  };

  type NewMetadata = {
    id : OldVideoId;
    title : Text;
    chunkCount : Nat;
    isComplete : Bool;
    isPersistent : Bool;
  };

  type NewVideo = {
    title : Text;
    content : Storage.ExternalBlob;
    metadata : NewMetadata;
  };

  type NewActor = {
    nextVideoId : OldVideoId;
    nextChunkId : OldChunkId;
    videoMetadata : Map.Map<OldVideoId, NewMetadata>;
    videoChunks : Map.Map<OldVideoId, List.List<OldChunkId>>;
    videos : Map.Map<OldVideoId, NewVideo>;
  };

  public func run(old : OldActor) : NewActor {
    let videoMetadata = old.videoMetadata.map<OldVideoId, OldMetadata, NewMetadata>(
      func(_id, entry) {
        {
          entry with
          isPersistent = false;
        };
      }
    );

    let videos = old.videos.map<OldVideoId, OldVideo, NewVideo>(
      func(_id, video) {
        {
          video with
          metadata = {
            video.metadata with
            isPersistent = false;
          };
        };
      }
    );

    {
      old with
      videoMetadata;
      videos;
    };
  };
};
