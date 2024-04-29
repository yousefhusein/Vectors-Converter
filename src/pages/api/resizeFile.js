import { hex } from "color-convert";
import sharp from "sharp";

const fileTypes = [
  { label: "PNG", value: "png" },
  { label: "JPG", value: "jpg" },
  { label: "JPEG", value: "jpeg" },
  { label: "WEBP", value: "webp" },
];

const sizes = [
  { label: "16x16", value: 16 },
  { label: "32x32", value: 32 },
  { label: "64x64", value: 64 },
  { label: "128x128", value: 128 },
  { label: "256x256", value: 256 },
  { label: "512x512", value: 512 },
  { label: "1024x1024", value: 1024 },
  { label: "2048x2048", value: 2048 },
  { label: "4096x4096", value: 4096 },
];

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default function handler(req, res) {
  if (req.method === "POST") {
    let backgroundColor = req.body.backgroundColor || false;
    let outputFileSize = Number(req.body.outputFileSize);
    let outputFileType = req.body.outputFileType;

    if (backgroundColor !== false && !hex.rgb(backgroundColor)) {
      res.status(400).json({
        message: `BackgroundColor: "${req.body.backgroundColor}" is invalid hex-color`,
      });
    } else if (fileTypes.findIndex((x) => x.value === outputFileType) === -1) {
      res.status(400).json({
        message: `outputFileType: "${
          req.body.outputFileType
        }" is not supported file type, supported file types are ${fileTypes
          .map((x) => x.value)
          .join(", ")}`,
      });
    } else if (sizes.findIndex((x) => x.value === outputFileSize) === -1) {
      res.status(400).json({
        message: `outputFileSize: "${
          req.body.outputFileSize
        }" is not supported size, supported sizes are ${sizes
          .map((x) => x.value)
          .join(", ")}`,
      });
    } else {
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      sharp(Buffer.from(req.body.buffer))
        .resize(outputFileSize, outputFileSize)
        .toFormat(outputFileType)
        .flatten(backgroundColor ? { background: backgroundColor } : false)
        .toBuffer()
        .then((buffer) => {
          res.status(200).json(buffer.toJSON());
        });
    }
  } else {
    res.status(404).json({
      message: 'If you trying to resize a file, try "POST" method',
    });
  }
}
