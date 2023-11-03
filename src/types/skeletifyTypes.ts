export type SkeletifyResponse = SkeletifiedImage;

export interface SkeletifyRequestBody {
    name: string;
    type: string;
    data: string;
}

export interface SkeletifiedImage {
    imageType: string;
    skeleton: string;
    strokes: string[];
}
