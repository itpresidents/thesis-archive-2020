import React from "react";

const VimeoEmbed = ({ vimeoVideoId }: { vimeoVideoId: string }) => (
  <iframe
    src={`https://player.vimeo.com/video/${vimeoVideoId}`}
    title="vimeo"
    width="640"
    height="360"
    frameBorder="0"
    allow="autoplay; fullscreen"
    allowFullScreen
  ></iframe>
);

export default VimeoEmbed;
