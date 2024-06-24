'use client'

import { Buffer } from 'buffer'
import React from 'react'
import axios from 'axios'

import { Icon } from '@iconify/react'
import Select from './ui/select'
import Button from './ui/button'
import Input from './ui/input'

import Progress from './ui/progress'
import { fileTypes, sizes } from '@/lib/constants'
import { calculatePercentage, downloadBuffer } from '@/lib/utils'

export default function Page() {
  const [file, setFile] = React.useState<File>()
  const [loading, setLoading] = React.useState(false)
  const [uploaded, setUploaded] = React.useState<number[]>()
  const [downloaded, setDownloaded] = React.useState<number[]>()
  const [backgroundColorDisabled, setBackgroundColorDisabled]
    = React.useState(true)

  const handleChange = (event: any) => {
    setFile(event.target?.files?.[0])
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const fileReader = new FileReader()

    setLoading(true)

    fileReader.onload = (event) => {
      if (event.target?.result) {
        const fileExtension = formData.get('outputFileType')

        axios
          .post(
            '/api/resizeFile',
            {
              outputFileType: fileExtension,
              outputFileSize: Number.parseInt(formData.get('outputFileSize') as string),
              backgroundColor: formData.get('backgroundColor'),
              buffer: Buffer.from(event.target.result as ArrayBuffer).toJSON(),
            },
            {
              timeout: 7200000,
              onUploadProgress: (event) => {
                setUploaded([event.loaded, event.total!])
              },
              onDownloadProgress: (event) => {
                setDownloaded([event.loaded, event.total!])
              },
            },
          )
          .then((response) => {
            if (response.data) {
              downloadBuffer(
                Buffer.from(response.data),
              `image/${fileExtension}`,
              `${file?.name.replace(/\.svg$/, '')}.${fileExtension}`,
              ).then(() => setLoading(false))
            }
          })
          .catch((error) => {
            console.error(error)
            setLoading(false)
            setDownloaded(void 0)
            setUploaded(void 0)
          })
      }
    }

    fileReader.readAsArrayBuffer(file!)
  }

  return (
    <main className="w-full py-5">
      <div className="container mx-auto max-w-5xl">
        <form className="border relative overflow-hidden rounded-lg w-full" onSubmit={handleSubmit}>
          <div className="text-center bg-indigo-900 text-gray-50 border-b px-5 py-5">
            <p className="font-bold text-xl">VECTORS CONVERTER</p>
          </div>
          <div className="px-5 py-5">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <Input
                type="file"
                formLabel="SVG FILE"
                accept="image/svg+xml"
                required={true}
                name="inputFile"
                id="input-file"
                onChange={handleChange}
              />
              <div className="mb-2">
                <Input
                  type="color"
                  formLabel="BACKGROUND COLOR"
                  required={true}
                  name="backgroundColor"
                  id="background-color"
                  disabled={!!backgroundColorDisabled}
                />
                <div className="px-2 flex items-center">
                  <input
                    className="form-checkbox"
                    type="checkbox"
                    id="flexCheckChecked"
                    checked={!backgroundColorDisabled}
                    aria-label="Enable background"
                    onChange={event =>
                      setBackgroundColorDisabled(!event.target.checked)}
                  />
                  <label htmlFor="flexCheckChecked" className="ms-1">Enabled</label>
                </div>
              </div>
              <Select
                options={fileTypes}
                formLabel="OUTPUT FORMAT"
                id="output-file-type"
                name="outputFileType"
                required={true}
              />
              <Select
                options={sizes}
                defaultValue={sizes[5].value}
                formLabel="OUTPUT SIZE"
                id="output-file-size"
                name="outputFileSize"
                required={true}
              />
            </div>
            {uploaded
              ? (
                <div className="px-2 py-2">
                  <Progress percent={calculatePercentage(uploaded, downloaded!)} />
                </div>
                )
              : ''}
          </div>
          <div className="px-5 py-3 flex gap-2 flex-wrap border-t">
            <Button
              type="submit"
              disabled={!!loading}
              className="bg-indigo-800 hover:bg-indigo-700 text-white"
              icon="material-symbols:download-2"
              onClick={() => {
                setDownloaded(void 0)
                setUploaded(void 0)
              }}
            >
              DOWNLOAD
            </Button>

            <Button
              className="bg-red-800 hover:bg-red-700 text-white"
              icon="material-symbols:delete-outline-rounded"
              onClick={() => {
                setDownloaded(void 0)
                setUploaded(void 0)
              }}
            >
              RESTORE
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
