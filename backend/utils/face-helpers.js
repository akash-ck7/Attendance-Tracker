import * as faceapi from "face-api.js";
import canvas from "canvas";
import path from "path";
import fs from "fs";

const { Canvas, Image, ImageData, loadImage } = canvas;

//using face-api for image sccaning
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(process.cwd(), "models");

//Load models from disk
export async function loadModels() {
  if (!fs.existsSync(MODEL_PATH)) {
    throw new Error(`Model path "${MODEL_PATH}" does not exist`);
  }

  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH),
    faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH),
    faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH),
  ]);

  console.log("Face-api models loaded");
}

//  Convert base64 image to canvas Image
export async function base64ToImage(base64String) {
  try {
    if (!base64String || typeof base64String !== "string") {
      throw new Error("Invalid base64 string");
    }

    const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      throw new Error("Base64 image format invalid");
    }

    const buffer = Buffer.from(matches[2], "base64");
    const img = await loadImage(buffer);
    return img;
  } catch (err) {
    console.error(" Failed to convert base64 to image:", err.message);
    throw err;
  }
}

// Extract face descriptor (embedding) for accurate validation from base64 image
export async function getFaceDescriptor(base64Image) {
  try {
    console.log(" getFaceDescriptor input length:", base64Image.length);

    const img = await base64ToImage(base64Image);

    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      console.warn(" No face detected in image.");
      return null;
    }

    return detection.descriptor;
  } catch (error) {
    console.error("Error in getFaceDescriptor:", error);
    return null;
  }
}
