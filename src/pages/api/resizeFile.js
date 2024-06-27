import { Buffer } from 'buffer'
import { hex } from 'color-convert'
import sharp from 'sharp'
import { fileTypes, sizes } from '@/lib/constants'

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default function handler(req, res) {
  if (req.method === 'POST') {
    const backgroundColor = req.body.backgroundColor || false
    const outputFileSize = Number(req.body.outputFileSize)
    const outputFileType = req.body.outputFileType
    const extend = +req.body.outputExtend

    if (Number.isNaN(extend) || extend < 0 || extend > 500) {
      res.status(400).json({
        message: `extend: "${req.body.outputExtend}" is invalid, it should >= 0 and <= 500 `,
      })
    }
    else if (backgroundColor !== false && !hex.rgb(backgroundColor)) {
      res.status(400).json({
        message: `BackgroundColor: "${req.body.backgroundColor}" is invalid hex-color`,
      })
    }
    else if (fileTypes.findIndex(x => x.value === outputFileType) === -1) {
      res.status(400).json({
        message: `outputFileType: "${
          req.body.outputFileType
        }" is not supported file type, supported file types are ${fileTypes
          .map(x => x.value)
          .join(', ')}`,
      })
    }
    else if (sizes.findIndex(x => x.value === outputFileSize) === -1) {
      res.status(400).json({
        message: `outputFileSize: "${
          req.body.outputFileSize
        }" is not supported size, supported sizes are ${sizes
          .map(x => x.value)
          .join(', ')}`,
      })
    }
    else {
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      sharp(Buffer.from(req.body.buffer))
        .resize(outputFileSize, outputFileSize)
        .toFormat(outputFileType)
        .flatten(backgroundColor ? { background: backgroundColor } : false)
        .extend({
          background: backgroundColor || '#00000000',
          bottom: extend,
          top: extend,
          left: extend,
          right: extend,
        }).toBuffer()
        .then((buffer) => {
          res.status(200).json(buffer.toJSON())
        })
    }
  }
  else {
    res.status(404).json({
      message: 'If you trying to resize a file, try "POST" method',
    })
  }
}
