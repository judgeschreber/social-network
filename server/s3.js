const aws = require("aws-sdk");
const { AWS_SECRET, AWS_KEY } = require("./secrets");
const fs = require("fs");

const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();
    promise
        .then(() => {
            next();
            fs.unlink(path, () => {});
        })
        .catch(() => {
            return res.sendStatus(500);
        });
};
