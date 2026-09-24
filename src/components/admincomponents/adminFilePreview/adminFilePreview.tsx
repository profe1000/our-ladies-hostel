import { useEffect, useState } from "react";
import {
  DownloadOutlined,
  ExportOutlined,
  FileOutlined,
  FilePdfOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { appZIndex } from "../../../utils/appconst";
import "./adminFilePreview.css";

export type IPreviewFile = {
  label: string;
  url: string;
};

type IFileKind = "image" | "pdf" | "other";

// Work out how to show a file from its URL
export const getFileKind = (url: string): IFileKind => {
  const path = url.split(/[?#]/)[0].toLowerCase();
  if (/\.(png|jpe?g|gif|webp|bmp|svg|avif)$/.test(path)) return "image";
  if (path.endsWith(".pdf")) return "pdf";
  // Uploads without an extension are most often photos
  if (!/\.[a-z0-9]{2,5}$/.test(path)) return "image";
  return "other";
};

/* ---------- Thumbnail that opens the preview ---------- */

type IFileThumbnail = {
  file: IPreviewFile;
  onOpen: () => void;
};

export const AdminFileThumbnail: React.FC<IFileThumbnail> = ({
  file,
  onOpen,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const kind = getFileKind(file.url);
  const showImage = kind === "image" && !imageFailed;

  return (
    <button
      type="button"
      className="filePrevThumb"
      onClick={onOpen}
      aria-label={`Preview ${file.label}`}
    >
      {showImage ? (
        <img
          src={file.url}
          alt={file.label}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="filePrevThumbIcon">
          {kind === "pdf" ? <FilePdfOutlined /> : <FileOutlined />}
        </span>
      )}
      <span className="filePrevThumbLabel myfont1">{file.label}</span>
    </button>
  );
};

/* ---------- Pop-up preview ---------- */

type IFilePreviewModal = {
  files: IPreviewFile[];
  // Index of the open file, or null when the pop-up is closed
  openIndex: number | null;
  onChange: (index: number | null) => void;
};

export const AdminFilePreviewModal: React.FC<IFilePreviewModal> = ({
  files,
  openIndex,
  onChange,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const isOpen = openIndex !== null && !!files[openIndex];
  const file = isOpen ? files[openIndex as number] : undefined;
  const kind = file ? getFileKind(file.url) : "other";
  const hasMany = files.length > 1;

  const goTo = (step: number) => {
    if (openIndex === null) return;
    onChange((openIndex + step + files.length) % files.length);
  };

  // Reset the image error state when switching files
  useEffect(() => {
    setImageFailed(false);
  }, [openIndex]);

  // Arrow keys move between files
  useEffect(() => {
    if (!isOpen || !hasMany) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goTo(1);
      if (event.key === "ArrowLeft") goTo(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <Modal
      open={isOpen}
      onCancel={() => onChange(null)}
      footer={null}
      centered
      width={880}
      zIndex={appZIndex.modal}
      className="filePrevModal"
      title={
        file && (
          <div className="filePrevTitle myfont1">
            <span className="filePrevName">{file.label}</span>
            {hasMany && (
              <span className="filePrevCount">
                {(openIndex as number) + 1} / {files.length}
              </span>
            )}
          </div>
        )
      }
    >
      {file && (
        <>
          <div className="filePrevStage">
            {kind === "image" && !imageFailed && (
              <img
                className="filePrevImage"
                src={file.url}
                alt={file.label}
                onError={() => setImageFailed(true)}
              />
            )}

            {kind === "pdf" && (
              <iframe
                className="filePrevFrame"
                src={file.url}
                title={file.label}
              />
            )}

            {(kind === "other" || (kind === "image" && imageFailed)) && (
              <div className="filePrevFallback myfont1">
                <FileOutlined className="filePrevFallbackIcon" />
                <p>This file cannot be previewed here.</p>
              </div>
            )}

            {hasMany && (
              <>
                <button
                  type="button"
                  className="filePrevNav filePrevNavPrev"
                  aria-label="Previous file"
                  onClick={() => goTo(-1)}
                >
                  <LeftOutlined />
                </button>
                <button
                  type="button"
                  className="filePrevNav filePrevNavNext"
                  aria-label="Next file"
                  onClick={() => goTo(1)}
                >
                  <RightOutlined />
                </button>
              </>
            )}
          </div>

          <div className="filePrevActions">
            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="adminBtn myfont1"
            >
              <ExportOutlined /> Open in new tab
            </a>
            <a href={file.url} download className="adminBtn myfont1">
              <DownloadOutlined /> Download
            </a>
          </div>
        </>
      )}
    </Modal>
  );
};
