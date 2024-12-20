// fileUtils.js

import fs from 'fs/promises'; // Use fs.promises for async/await
import path from 'path';
import File from "../mongodb/models/file.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const currentFileURL = import.meta.url;
const currentFilePath = fileURLToPath(currentFileURL);
const currentDirectory = dirname(currentFilePath);

export const updateFileById = async (fileId, storageDestination, session) => {
  console.log(fileId)
  const file = await File.findById(fileId);
  if (!file) {
    throw new Error("File not found");
  }

  // Use the provided storage destination as the base path
  const basePath = path.join(currentDirectory, storageDestination);

  // Construct the full file path
  const filePath = path.join(basePath, file.filePath);
  console.log(filePath)

  try {
    // Use fs.promises.unlink to delete the file
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
    throw new Error("Error deleting file");
  }

  // Remove the file from the database
  await file.deleteOne({ _id: fileId }, { session })
};
