const video = (name: string) =>
  `https://d3i78uz5w7h3ks.cloudfront.net/videos/${name}`;

class VideoCDN {
  static ExperimentVideoClip = video('experiment_clip.m4v');
  static PreviewApplicationClip = video('preview_app_clip.mp4');
  static TraceRequestClip = video('trace_clip.mp4');
}

export class CDNContent {
  static Video = VideoCDN;
}
