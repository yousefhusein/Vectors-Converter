"use client";

import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { fileTypes, sizes } from "./_utils/Constants";

import { Buffer } from "buffer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "./_components/Input";
import React from "react";
import Select from "./_components/Select";
import axios from "axios";

export default function Page() {
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(null);
  const [downloaded, setDownloaded] = React.useState(null);
  const [backgroundColorDisabled, setBackgroundColorDisabled] =
    React.useState(true);

  const calculatePercentage = () => {
    let percentage = 0;
    if (uploaded) {
      percentage += (uploaded[0] * 50) / uploaded[1];
    }
    if (downloaded) {
      percentage += (uploaded[0] * 50) / uploaded[1];
    }
    return percentage;
  };

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
            backgroundColor: formData.get("backgroundColor"),
            buffer: Buffer.from(event.target.result).toJSON(),
          },
          {
            timeout: 7200000,
            onUploadProgress: (event) => {
              setUploaded([event.loaded, event.total]);
            },
            onDownloadProgress: (event) => {
              setDownloaded([event.loaded, event.total]);
            },
          }
        )
        .then((response) => {
          if (response.data) {
            const buffer = Buffer.from(response.data);
            const dataURL = `data:image/${formData.get(
              "outputFileType"
            )};base64,${buffer.toString("base64")}`;
            const aElement = document.createElement("a");

            aElement.download = `${file.name.replace(
              ".svg",
              ""
            )}.${formData.get("outputFileType")}`;
            aElement.href = dataURL;
            aElement.click();
            setLoading(false);
          }
        })
        .catch((error) => {
          alert(error.message);
          setLoading(false);
          setDownloaded(null);
          setUploaded(null);
        });
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
                    onChange={(event) =>
                      setBackgroundColorDisabled(!event.target.checked)
                    }
                  />
                  <label
                    className="form-check-label user-select-none"
                    htmlFor="flexCheckChecked">
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
            {uploaded ? (
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${calculatePercentage()}%`,
                  }}>
                  {Math.round(calculatePercentage())}%
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="card-footer">
            <button
              className="btn btn-success"
              type="submit"
              onClick={() => {
                setDownloaded(null);
                setUploaded(null);
              }}
              disabled={!file || loading}>
              DOWNLOAD <FontAwesomeIcon icon={faDownload} size="1x" />
            </button>

            <button
              className="btn btn-danger ms-2"
              type="reset"
              disabled={!!(loading && uploaded)}
              onClick={() => {
                setFile(null);
                setLoading(false);
                setDownloaded(null);
                setUploaded(null);
                setBackgroundColorDisabled(true);
              }}>
              RESTORE <FontAwesomeIcon icon={faTrash} size="1x" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
