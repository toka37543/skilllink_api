const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const uploadRoot = path.join(__dirname, "../uploads");
const profilePicturesDir = path.join(uploadRoot, "profile-pictures");
const maxProfilePictureSize = 2 * 1024 * 1024;
const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];

function ensureUploadFolders() {
  fs.mkdirSync(profilePicturesDir, { recursive: true });
}

function getBoundary(contentType) {
  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || "");
  return match?.[1] || match?.[2] || null;
}

function getHeaderValue(headers, name) {
  return headers[name.toLowerCase()] ?? null;
}

function parsePartHeaders(headerText) {
  return headerText.split("\r\n").reduce((headers, line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      return headers;
    }

    const name = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();
    headers[name] = value;
    return headers;
  }, {});
}

function parseContentDisposition(value) {
  const fields = {};
  if (!value) {
    return fields;
  }

  value.split(";").forEach((part) => {
    const [rawKey, rawValue] = part.trim().split("=");
    if (!rawKey || rawValue == null) {
      return;
    }

    fields[rawKey] = rawValue.replace(/^"|"$/g, "");
  });

  return fields;
}

function trimPartBody(body) {
  if (body.length >= 2 && body[body.length - 2] === 13 && body[body.length - 1] === 10) {
    return body.subarray(0, body.length - 2);
  }

  return body;
}

function detectImage(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: "image/jpeg", extension: "jpg" };
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mimeType: "image/png", extension: "png" };
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { mimeType: "image/webp", extension: "webp" };
  }

  return null;
}

function parseMultipart(buffer, boundary) {
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const parts = [];
  let position = buffer.indexOf(boundaryBuffer);

  while (position !== -1) {
    const nextPosition = buffer.indexOf(boundaryBuffer, position + boundaryBuffer.length);
    if (nextPosition === -1) {
      break;
    }

    let part = buffer.subarray(position + boundaryBuffer.length, nextPosition);
    if (part.length >= 2 && part[0] === 13 && part[1] === 10) {
      part = part.subarray(2);
    }

    if (part.length >= 2 && part[0] === 45 && part[1] === 45) {
      break;
    }

    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd !== -1) {
      const headerText = part.subarray(0, headerEnd).toString("utf8");
      const body = trimPartBody(part.subarray(headerEnd + 4));
      parts.push({ headers: parsePartHeaders(headerText), body });
    }

    position = nextPosition;
  }

  return parts;
}

function sendUploadError(res, status, message) {
  return res.status(status).send({
    success: false,
    message
  });
}

function singleProfilePictureUpload(req, res, next) {
  const contentType = req.headers["content-type"] || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return sendUploadError(res, 400, "Profile picture must be uploaded as multipart/form-data");
  }

  const boundary = getBoundary(contentType);
  if (!boundary) {
    return sendUploadError(res, 400, "Missing multipart boundary");
  }

  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > maxProfilePictureSize + 4096) {
    return sendUploadError(res, 413, "Profile picture must be 2MB or smaller");
  }

  const chunks = [];
  let received = 0;
  let tooLarge = false;

  req.on("data", (chunk) => {
    received += chunk.length;
    if (received > maxProfilePictureSize + 4096) {
      tooLarge = true;
      return;
    }

    chunks.push(chunk);
  });

  req.on("error", () => {
    return sendUploadError(res, 400, "Could not read uploaded file");
  });

  req.on("end", () => {
    if (tooLarge) {
      return sendUploadError(res, 413, "Profile picture must be 2MB or smaller");
    }

    const parts = parseMultipart(Buffer.concat(chunks), boundary);
    const filePart = parts.find((part) => {
      const disposition = parseContentDisposition(getHeaderValue(part.headers, "content-disposition"));
      return ["profile_picture", "file"].includes(disposition.name) && disposition.filename;
    });

    if (!filePart) {
      return sendUploadError(res, 400, "Missing profile_picture file");
    }

    if (filePart.body.length > maxProfilePictureSize) {
      return sendUploadError(res, 413, "Profile picture must be 2MB or smaller");
    }

    const declaredMimeType = getHeaderValue(filePart.headers, "content-type");
    if (!allowedImageMimeTypes.includes(declaredMimeType)) {
      return sendUploadError(res, 400, "Profile picture must be a JPG, PNG, or WEBP image");
    }

    const detectedImage = detectImage(filePart.body);
    if (!detectedImage || detectedImage.mimeType !== declaredMimeType) {
      return sendUploadError(res, 400, "Uploaded file content does not match an allowed image type");
    }

    ensureUploadFolders();

    const fileName = `${crypto.randomUUID()}.${detectedImage.extension}`;
    const filePath = path.join(profilePicturesDir, fileName);
    fs.writeFileSync(filePath, filePart.body);

    req.uploadedFile = {
      fileName,
      filePath,
      mimeType: detectedImage.mimeType,
      size: filePart.body.length,
      publicPath: `/uploads/profile-pictures/${fileName}`
    };

    return next();
  });
}

module.exports = {
  uploadRoot,
  profilePicturesDir,
  singleProfilePictureUpload
};
