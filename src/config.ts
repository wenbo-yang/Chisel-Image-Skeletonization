export class Config {
    public imageHeight = 50;
    public imageWidth = 50;

    public grayScaleWhiteThreshold = 250;

    public shortName = 'c-skeletonize';

    public useGpuSkeletonizer = false;

    public env = process.env.NODE_ENV || 'development';

}
