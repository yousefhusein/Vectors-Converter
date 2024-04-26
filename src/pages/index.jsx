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
  { label: "8192x8192", value: 8192 },
];

export default function Page() {
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const fileReader = new FileReader();

    setLoading(true);

    fileReader.onload = async (event) => {
      try {
        const response = await fetch("/api/resizeFile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            outputFileType: formData.get("outputFileType"),
            outputFileSize: parseInt(formData.get("outputFileSize")),
            buffer: Array.from(new Uint8Array(event.target.result)),
          }),
        });

        if (response.ok) {
          const buffer = Buffer.from(await response.json());
          const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;
          const aElement = document.createElement("a");

          aElement.download = `${file.name.replace(".svg", "")}.${formData.get(
            "outputFileType"
          )}`;
          aElement.href = dataURL;
          aElement.click();
        } else {
          throw new Error("Request failed");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="w-100 py-5">
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
          </div>
          <div className="card-footer">
            <button
              className="btn btn-success m-1"
              type="submit"
              disabled={!file || loading}>
              DOWNLOAD <FontAwesomeIcon icon={faDownload} size="1x" />
            </button>

            <button
              className="btn btn-danger m-1"
              type="reset"
              disabled={loading}
              onClick={() => {
                setFile(null);
                setLoading(false);
              }}>
              RESTORE <FontAwesomeIcon icon={faTrash} size="1x" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
