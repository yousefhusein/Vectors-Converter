'use client'

import { Buffer } from 'buffer'
import React from 'react'
import axios from 'axios'

import { Icon } from '@iconify/react'
import Select from './ui/select'
import Input from './ui/input'

import { fileTypes, sizes } from '@/lib/constants'
import { calculatePercentage, downloadBuffer } from '@/lib/utils'

export default function Page() {
  const [file, setFile] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [uploaded, setUploaded] = React.useState(null)
  const [downloaded, setDownloaded] = React.useState(null)
  const [backgroundColorDisabled, setBackgroundColorDisabled]
    = React.useState(true)

  const handleChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const fileReader = new FileReader()

    setLoading(true)

    fileReader.onload = (event) => {
      const fileExtension = formData.get('outputFileType')

      axios
        .post(
          '/api/resizeFile',
          {
            outputFileType: fileExtension,
            outputFileSize: Number.parseInt(formData.get('outputFileSize')),
            backgroundColor: formData.get('backgroundColor'),
            buffer: Buffer.from(event.target.result).toJSON(),
          },
          {
            timeout: 7200000,
            onUploadProgress: (event) => {
              setUploaded([event.loaded, event.total])
            },
            onDownloadProgress: (event) => {
              setDownloaded([event.loaded, event.total])
            },
          },
        )
        .then((response) => {
          if (response.data) {
            downloadBuffer(
              Buffer.from(response.data),
              `image/${fileExtension}`,
              `${file.name.replace(/\.svg$/, '')}.${fileExtension}`,
            ).then(() => setLoading(false))
          }
        })
        .catch((error) => {
          console.error(error)
          setLoading(false)
          setDownloaded(null)
          setUploaded(null)
        })
    }

    fileReader.readAsArrayBuffer(file)
  }

  return (
    <main className="w-100 py-5">
      <div className="container">
        <form className="card w-100" onSubmit={handleSubmit}>
          <div className="card-header text-center">
            <p className="fw-bold h4">VECTORS CONVERTER</p>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-lg-6 p-3">
                <Input
                  type="file"
                  formLabel="SVG FILE"
                  accept="image/svg+xml"
                  required={true}
                  name="inputFile"
                  id="input-file"
                  onChange={handleChange}
                />
                <Input
                  type="color"
                  formLabel="BACKGROUND COLOR"
                  required={true}
                  name="backgroundColor"
                  id="background-color"
                  disabled={!!backgroundColorDisabled}
                />
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckChecked"
                    checked={!backgroundColorDisabled}
                    onChange={event =>
                      setBackgroundColorDisabled(!event.target.checked)}
                  />
                  <label
                    className="form-check-label user-select-none"
                    htmlFor="flexCheckChecked"
                  >
                    Background Color
                  </label>
                </div>
              </div>
              <div className="col-12 col-lg-6 p-3">
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
            </div>
            {uploaded
              ? (
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    style={{
                      width: `${calculatePercentage(uploaded, downloaded)}%`,
                    }}
                  >
                    {Math.round(calculatePercentage(uploaded, downloaded))}
                    %
                  </div>
                </div>
                )
              : (
                  ''
                )}
          </div>
          <div className="card-footer">
            <button
              className="btn btn-success"
              type="submit"
              onClick={() => {
                setDownloaded(null)
                setUploaded(null)
              }}
              disabled={!file || loading}
            >
              DOWNLOAD
              {' '}
              <Icon icon="material-symbols:download-2" />
            </button>

            <button
              className="btn btn-danger ms-2"
              type="reset"
              disabled={!!(loading && uploaded)}
              onClick={() => {
                setFile(null)
                setLoading(false)
                setDownloaded(null)
                setUploaded(null)
                setBackgroundColorDisabled(true)
              }}
            >
              RESTORE
              {' '}
              <Icon icon="material-symbols:delete-outline-rounded" />
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
