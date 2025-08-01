import { Image as IKImage, buildSrc } from "@imagekit/react";

const urlEndpoint = import.meta.env.VITE_PUBLIC_URL_ENDPOINT;
export const buildImageSrc = (options) => {
  return buildSrc({
    urlEndpoint,
    ...options,
  });
};

const Image = (props) => {
  if (!urlEndpoint) {
    console.error("ImageKit urlEndpoint is not defined");
    return null;
  }
  return <IKImage urlEndpoint={urlEndpoint} {...props} />;
};

export default Image;
