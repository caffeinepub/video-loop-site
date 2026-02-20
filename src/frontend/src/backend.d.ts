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
export type VideoId = bigint;
export interface VideoMetadata {
    id: VideoId;
    title: string;
    chunkCount: bigint;
    isPersistent: boolean;
    isComplete: boolean;
}
export interface backendInterface {
    getAllVideoMetadata(): Promise<Array<VideoMetadata>>;
    getAllVideos(): Promise<Array<Video>>;
    removeVideo(id: VideoId): Promise<boolean>;
    updateVideoMetadata(id: VideoId, newTitle: string): Promise<boolean>;
}
