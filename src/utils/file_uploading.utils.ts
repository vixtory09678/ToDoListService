import { existsSync, mkdirSync } from "fs";
import { extname } from "path";
import { v4 as uuid } from "uuid";

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
  const uploadPath = `${__dirname}/../uploads`;
  // Create folder if doesn't exist
  if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
  }
  cb(null, uploadPath);
}