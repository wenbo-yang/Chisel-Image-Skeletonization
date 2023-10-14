export interface SkeletifyResponse {
    skeleton: ArrayBuffer[];
    strokes: ArrayBuffer[][];
}

export interface SkeletifyRequestBody {
    name: string;
    type: string;
    data: Buffer;
}
