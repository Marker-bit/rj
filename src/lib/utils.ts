import { type ClassValue, clsx } from "clsx";
import { formatRelative } from "date-fns";
import { ru } from "date-fns/locale";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import { PixelCrop } from "react-image-crop";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateToString(date: Date) {
  if (date.getHours() === 0 && date.getMinutes() === 0) {
    return formatRelative(date, new Date(), {
      locale: ru,
    }).replace(" в 0:00", "");
  }
  return formatRelative(date, new Date(), {
    locale: ru,
  });
  const yesterday = moment().subtract(1, "day");
  if (moment(date).isSame(new Date(), "day")) {
    return `Сегодня в ${date.getHours()}:${date.getMinutes()}`;
  } else if (moment(date).isSame(yesterday, "day")) {
    return `Вчера в ${date.getHours()}:${date.getMinutes()}`;
  } else {
    return moment(date).calendar();
  }
  return date.toLocaleString();
}

export async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  // const pixelRatio = 1

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}

let previewUrl = "";

function toBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
}

// Returns an image source you should set to state and pass
// `{previewSrc && <img alt="Crop preview" src={previewSrc} />}`
export async function imgPreview(image: HTMLImageElement, crop: PixelCrop) {
  const canvas = document.createElement("canvas");
  canvasPreview(image, canvas, crop);

  const blob = await toBlob(canvas);

  if (!blob) {
    console.error("Failed to create blob");
    return "";
  }

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }

  previewUrl = URL.createObjectURL(blob);
  return previewUrl;
}

export function declOfNum(number: number, words: string[]) {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? Math.abs(number) % 10 : 5]
  ];
}
