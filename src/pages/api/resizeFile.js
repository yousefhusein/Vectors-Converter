import sharp from "sharp";

/**
 * Resize A File
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default function handler(req, res) {
  if (req.method === "POST") {
    sharp(Buffer.from(req.body.buffer))
      .resize(req.body.outputFileSize, req.body.outputFileSize)
      .toFormat(req.body.outputFileType)
      .toBuffer()
      .then((buffer) => {
        res.status(200).json(buffer.toJSON());
      });
  } else {
    res.status(404).json({
      message: 'If you trying to resize a file, try "POST" method',
    });
  }
}
