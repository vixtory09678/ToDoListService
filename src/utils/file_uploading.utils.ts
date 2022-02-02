import { existsSync, mkdirSync, unlinkSync } from "fs";
import { extname } from "path";
import { v4 as uuid } from "uuid";

const imagesPath = `${__dirname}/../uploads`;

export const editFileName = (req, file: Express.Multer.File, callback) => {
  const fileExtName = extname(file.originalname);
  callback(null, `image-${uuid()}-${Date.now()}${fileExtName}`);
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const handleDestination = (req, file, cb) => {
  // Create folder if doesn't exist
  if (!existsSync(imagesPath)) {
      mkdirSync(imagesPath);
  }
  cb(null, imagesPath);
}

export const deleteFile = (path: string) :Boolean =>{
  try {
    unlinkSync(imagesPath + path);
    return true;
  } catch (err) {
    return false;
  }
}