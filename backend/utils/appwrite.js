const { Client, Storage, Permission, Role } = require('node-appwrite');

const appwriteEndpoint = process.env.APPWRITE_ENDPOINT;
const appwriteProjectId = process.env.APPWRITE_PROJECT_ID;
const appwriteApiKey = process.env.APPWRITE_API_KEY;
const appwriteBucketId = process.env.APPWRITE_BUCKET_ID;

if (!appwriteEndpoint || !appwriteProjectId || !appwriteApiKey || !appwriteBucketId) {
  throw new Error('Missing Appwrite configuration. Check APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_BUCKET_ID.');
}

const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId)
  .setKey(appwriteApiKey);

const storage = new Storage(client);

const buildPublicFileUrl = (fileId) => {
  const base = appwriteEndpoint.replace(/\/$/, '');
  const project = encodeURIComponent(appwriteProjectId);
  const bucket = encodeURIComponent(appwriteBucketId);
  const file = encodeURIComponent(fileId);
  return `${base}/storage/buckets/${bucket}/files/${file}/view?project=${project}`;
};

const buildPublicDownloadUrl = (fileId) => {
  const base = appwriteEndpoint.replace(/\/$/, '');
  const project = encodeURIComponent(appwriteProjectId);
  const bucket = encodeURIComponent(appwriteBucketId);
  const file = encodeURIComponent(fileId);
  return `${base}/storage/buckets/${bucket}/files/${file}/download?project=${project}`;
};

const publicReadPermissions = [Permission.read(Role.any())];

module.exports = {
  storage,
  appwriteBucketId,
  buildPublicFileUrl,
  buildPublicDownloadUrl,
  publicReadPermissions,
};
