const { storage, appwriteBucketId, publicReadPermissions } = require('../utils/appwrite');
const { Query } = require('node-appwrite');

const PAGE_LIMIT = 100;

const updateAllFiles = async () => {
  let offset = 0;
  let updatedCount = 0;

  while (true) {
    const response = await storage.listFiles(appwriteBucketId, [
      Query.limit(PAGE_LIMIT),
      Query.offset(offset),
    ]);

    const files = response?.files || [];

    for (const file of files) {
      await storage.updateFile(appwriteBucketId, file.$id, file.name, publicReadPermissions);
      updatedCount += 1;
    }

    if (files.length < PAGE_LIMIT) {
      break;
    }

    offset += PAGE_LIMIT;
  }

  console.log(`Updated ${updatedCount} files to public read.`);
};

updateAllFiles().catch((error) => {
  console.error('Failed to update file permissions:', error.message);
  process.exitCode = 1;
});
