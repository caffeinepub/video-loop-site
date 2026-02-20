import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    title: string;
    content: ExternalBlob;
    metadata: VideoMetadata;
}
export type Result = {
    __kind__: "error";
    error: string;
} | {
    __kind__: "success";
    success: null;
};
export type VideoId = bigint;
export interface VideoMetadata {
    id: VideoId;
    title: string;
    chunkCount: bigint;
    isPersistent: boolean;
    isComplete: boolean;
}
export interface backendInterface {
    finalizeVideoUpload(videoId: VideoId): Promise<Result>;
    getAllVideoMetadata(): Promise<Array<VideoMetadata>>;
    getAllVideos(): Promise<Array<Video>>;
    getMasterVideo(videoId: VideoId): Promise<Video | null>;
    getVideoMetadata(id: VideoId): Promise<VideoMetadata | null>;
    initializeVideo(title: string): Promise<VideoId>;
    removeVideo(id: VideoId): Promise<boolean>;
    updateVideoMetadata(id: VideoId, newTitle: string): Promise<boolean>;
    uploadChunk(videoId: VideoId, content: ExternalBlob): Promise<boolean>;
}
