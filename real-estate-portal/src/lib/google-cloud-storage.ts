import { Storage } from '@google-cloud/storage';

let storageClient: Storage | null = null;

/**
 * Initialize Google Cloud Storage client
 */
export const initializeGCS = () => {
  if (storageClient) return storageClient;

  const projectId = process.env.GOOGLE_PROJECT_ID;
  const keyFilePath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;

  if (!projectId) {
    throw new Error('GOOGLE_PROJECT_ID not set');
  }

  if (!keyFilePath) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY_PATH not set');
  }

  storageClient = new Storage({
    projectId,
    keyFilename: keyFilePath,
  });

  return storageClient;
};

/**
 * Get GCS bucket
 */
export const getGCSBucket = () => {
  const storage = initializeGCS();
  const bucketName = process.env.GCS_BUCKET_NAME || 'real-estate-hub-documents';
  return storage.bucket(bucketName);
};

/**
 * Upload file to Google Cloud Storage
 * Organizes by: /[entity]/[type]/[year]/filename
 */
export const uploadFileToGCS = async (
  fileBuffer: Buffer,
  fileName: string,
  entitySlug: string,
  fileType: 'taxes' | 'documents' | 'other' = 'documents',
  year?: number
): Promise<string> => {
  try {
    const bucket = getGCSBucket();

    // Build path: /entity/type/year/filename
    const year_str = year ? `/${year}` : '';
    const filePath = `${entitySlug}/${fileType}${year_str}/${fileName}`;

    // Create file reference
    const file = bucket.file(filePath);

    // Upload the file
    await file.save(fileBuffer, {
      metadata: {
        contentType: 'application/octet-stream',
        metadata: {
          entity: entitySlug,
          type: fileType,
          uploadDate: new Date().toISOString(),
        },
      },
    });

    console.log(`✅ File uploaded to GCS: gs://${bucket.name}/${filePath}`);

    // Return the GCS path
    return `gs://${bucket.name}/${filePath}`;
  } catch (error) {
    console.error('❌ GCS upload error:', error);
    throw error;
  }
};

/**
 * Download file from Google Cloud Storage
 */
export const downloadFileFromGCS = async (gcspath: string): Promise<Buffer> => {
  try {
    const bucket = getGCSBucket();

    // Parse path: gs://bucket/path/to/file
    const filePath = gcspath.replace(`gs://${bucket.name}/`, '');
    const file = bucket.file(filePath);

    // Download the file
    const [buffer] = await file.download();

    console.log(`✅ File downloaded from GCS: ${gcspath}`);
    return buffer;
  } catch (error) {
    console.error('❌ GCS download error:', error);
    throw error;
  }
};

/**
 * Delete file from Google Cloud Storage
 */
export const deleteFileFromGCS = async (gcspath: string): Promise<void> => {
  try {
    const bucket = getGCSBucket();

    // Parse path: gs://bucket/path/to/file
    const filePath = gcspath.replace(`gs://${bucket.name}/`, '');
    const file = bucket.file(filePath);

    // Delete the file
    await file.delete();

    console.log(`✅ File deleted from GCS: ${gcspath}`);
  } catch (error) {
    console.error('❌ GCS delete error:', error);
    throw error;
  }
};

/**
 * List files in a GCS folder
 */
export const listFilesInGCS = async (
  entitySlug: string,
  fileType: string = 'documents',
  year?: number
): Promise<string[]> => {
  try {
    const bucket = getGCSBucket();

    // Build prefix: /entity/type/year/
    const year_str = year ? `/${year}` : '';
    const prefix = `${entitySlug}/${fileType}${year_str}/`;

    // List files
    const [files] = await bucket.getFiles({ prefix });

    const filePaths = files
      .filter((file) => file.name !== prefix) // Exclude the folder itself
      .map((file) => `gs://${bucket.name}/${file.name}`);

    console.log(`📂 Listed ${filePaths.length} files in ${prefix}`);
    return filePaths;
  } catch (error) {
    console.error('❌ GCS list error:', error);
    throw error;
  }
};

/**
 * Get public URL for a file (if bucket is public)
 * WARNING: Only use for public files
 */
export const getPublicURLForGCSFile = (gcspath: string): string => {
  const bucketName = process.env.GCS_BUCKET_NAME || 'real-estate-hub-documents';
  const filePath = gcspath.replace(`gs://${bucketName}/`, '');
  return `https://storage.googleapis.com/${bucketName}/${filePath}`;
};

/**
 * Get signed URL for temporary file access (private files)
 * URL expires after 1 hour by default
 */
export const getSignedURLForGCSFile = async (
  gcspath: string,
  expirationHours: number = 1
): Promise<string> => {
  try {
    const bucket = getGCSBucket();

    // Parse path: gs://bucket/path/to/file
    const filePath = gcspath.replace(`gs://${bucket.name}/`, '');
    const file = bucket.file(filePath);

    // Generate signed URL
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expirationHours * 60 * 60 * 1000,
    });

    console.log(`🔗 Signed URL generated (expires in ${expirationHours}h): ${gcspath}`);
    return signedUrl;
  } catch (error) {
    console.error('❌ Signed URL generation error:', error);
    throw error;
  }
};

/**
 * Create a folder structure for a new entity
 */
export const initializeEntityFolders = async (entitySlug: string): Promise<void> => {
  try {
    const bucket = getGCSBucket();

    const folders = [
      `${entitySlug}/documents/`,
      `${entitySlug}/taxes/2024/`,
      `${entitySlug}/taxes/2025/`,
      `${entitySlug}/taxes/2026/`,
      `${entitySlug}/property-documents/`,
    ];

    for (const folder of folders) {
      const file = bucket.file(folder);
      // Create empty file as folder marker
      await file.save('', {
        metadata: {
          contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      });
      console.log(`📁 Created GCS folder: ${folder}`);
    }
  } catch (error) {
    console.error('❌ Error initializing entity folders:', error);
    throw error;
  }
};

/**
 * Generate a ZIP file from multiple GCS files
 * Useful for tax bundle exports
 */
export const createTaxBundleZIP = async (
  entitySlug: string,
  year: number
): Promise<Buffer> => {
  try {
    // This would use JSZip library
    // For now, return placeholder
    console.log(`📦 Creating tax bundle ZIP: ${entitySlug}/${year}`);
    throw new Error('ZIP creation not yet implemented. Use JSZip library.');
  } catch (error) {
    console.error('❌ ZIP creation error:', error);
    throw error;
  }
};

/**
 * Estimate GCS storage usage for an entity
 */
export const getEntityStorageUsage = async (entitySlug: string): Promise<{
  totalFiles: number;
  totalSizeBytes: number;
  totalSizeGB: number;
}> => {
  try {
    const bucket = getGCSBucket();
    const [files] = await bucket.getFiles({ prefix: `${entitySlug}/` });

    let totalSize = 0;
    files.forEach((file) => {
      totalSize += file.metadata?.size || 0;
    });

    const totalSizeGB = totalSize / (1024 * 1024 * 1024);

    console.log(
      `💾 Storage usage for ${entitySlug}: ${files.length} files, ${totalSizeGB.toFixed(2)}GB`
    );

    return {
      totalFiles: files.length,
      totalSizeBytes: totalSize,
      totalSizeGB,
    };
  } catch (error) {
    console.error('❌ Storage usage error:', error);
    throw error;
  }
};
