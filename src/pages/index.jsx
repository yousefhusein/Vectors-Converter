"use client";

import { Blob, Buffer } from "buffer";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "./_components/Input";
import React from "react";
import Select from "./_components/Select";
import axios from "axios";

const fileTypes = [
  { label: "PNG", value: "png" },
  { label: "JPG", value: "jpg" },
  { label: "JPEG", value: "jpeg" },
  { label: "WEBP", value: "webp" },
];

const sizes = [
  { label: "4x4", value: 4 },
  { label: "8x8", value: 8 },
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

export default function Page() {
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(null);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const fileReader = new FileReader();

    setLoading(true);

    fileReader.onload = (event) => {
      axios
        .post(
          "/api/resizeFile",
          {
            outputFileType: formData.get("outputFileType"),
            outputFileSize: parseInt(formData.get("outputFileSize")),
            buffer: Buffer.from(event.target.result).toJSON(),
          },
          {
            onUploadProgress: (event) => {
              setUploaded([event.loaded, event.total]);
            },
          }
        )
        .then((response) => {
          if (response.data) {
            const buffer = Buffer.from(response.data);
            const dataURL = `data:image/png;base64,${buffer.toString(
              "base64"
            )}`;
            const aElement = document.createElement("a");

            aElement.download = `${file.name.replace(
              ".svg",
              ""
            )}.${formData.get("outputFileType")}`;
            aElement.href = dataURL;
            aElement.click();
            setLoading(false);
          }
        });
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="w-100 py-5">
      <div className="container">
        <form className="card w-100" onSubmit={handleSubmit}>
          <div className="card-header text-center">
            <p className="fw-bold h4">IMAGE CONVERTER</p>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-lg-6 p-3">
                <Input
                  type="file"
                  formLabel="ENTER YOUR SVG FILE"
                  accept="image/svg+xml"
                  required={true}
                  name="inputFile"
                  id="input-file"
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 col-lg-6 p-3">
                <Select
                  options={fileTypes}
                  formLabel="CONVERT TO"
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
            {uploaded ? (
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${(uploaded[0] * 100) / uploaded[1]}%`,
                  }}>
                  {Math.round((uploaded[0] * 100) / uploaded[1])}%
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="card-footer">
            <button
              className="btn btn-success btn-lg"
              type="submit"
              disabled={!file || loading}>
              DOWNLOAD <FontAwesomeIcon icon={faDownload} />
            </button>

            <button
              className="btn btn-danger btn-lg ms-2"
              type="reset"
              onClick={() => setFile(null)}>
              RESTORE <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
