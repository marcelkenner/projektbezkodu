export default ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-aws-s3',
      providerOptions: {
        s3Options: { region: env('AWS_REGION', 'us-east-1') },
        params: { Bucket: env('S3_BUCKET') },
      },
    },
  },
});
