import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ApiResponse } from 'src/utils/api-response.util';

@Injectable()
export class AwsS3Service {
  constructor() {}

  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    region: process.env.AWS_S3_REGION,
  });

  async upload(file: Express.Multer.File) {
    const fileName = `${crypto.randomUUID()}.${this.getFileExtention(file)}`;
    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      if (s3Response.Location != null) {
        return ApiResponse(fileName);
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Failed to upload to S3');
    }
  }

  getFileExtention(file: Express.Multer.File) {
    const fileName = file.originalname;
    const lastIndex = fileName.lastIndexOf('.');
    if (lastIndex == -1) {
      return '';
    }
    return fileName.substring(lastIndex + 1);
  }
}
