import { fileTypes, sizes } from "../_utils/Constants";

import { hex } from "color-convert";
import sharp from "sharp";

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
