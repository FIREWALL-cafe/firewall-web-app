const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');

// Configure AWS SDK v3 for Digital Ocean Spaces
const s3Client = new S3Client({
  endpoint: 'https://nyc3.digitaloceanspaces.com',
  region: 'us-east-1', // Required but not used by DO Spaces
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
  }
});

const bucketName = 'firewall-cafe-space';

// Remove the old progress bar helper functions and replace with cli-progress setup
function createProgressBar(total) {
  const progressBar = new cliProgress.SingleBar({
    format: 'Progress |{bar}| {percentage}% | {value}/{total} Files',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });
  
  progressBar.start(total, 0);
  return progressBar;
}

// Images to upload from all event components
const images = [
  // VbkoVienna
  // 'VBKO_1.jpg',
  // 'VBKO_2.jpg',
  // 'VBKO_3.jpg',
  // 'VBKO_4.jpg',
  // 'VBKO_5.jpg',
  // 'VBKO_6.jpg',
  // 'VBKO_7.jpg',
  
  // OffSeventeen
  'FirewallOFFoslo6_1920.jpg',
  'FirewallOFFoslo3_1920.jpg',
  'FirewallOFFoslo5_1920.jpg',
  'FirewallOFFoslo1_1920.jpg',
  'FirewallOFFoslo_1920.jpg',
  'FirewallOFFoslo5_1920-1.jpg',
  
  // OffNyc
  'OFF17_1-1.jpg',
  'OFF17_2-1.jpg',
  'OFF17_3-1.jpg',
  'OFF17_4-1.jpg',
  
  // Marymount
  'FIREWALLMarymount2.29-4_edit.jpg',
  'FIREWALLMarymount2.29-7.jpg',
  'FIREWALLMarymount2.29-9.jpg',
  'FIREWALLMarymount2.29-12.jpg',
  'FIREWALLMarymount2.29-2_edit.jpg',
  
  // Inaugural
  'IMG_3948.jpg',
  'IMG_3814.jpg',
  'IMG_3774-1.jpg',
  'IMG_3864-2.jpg',
  'IMG_3960crop-1.jpeg',
  'IMG_4230crop.jpeg',
  'IMG_4212crop.jpeg',
  'IMG_4248.jpg',
  'IMG_3973.jpg',
  
  // OffEighteen
  'OFF18_expo1.jpg',
  'OFF18_expo2.jpg',
  'OFF18_expo3.jpg',
  'OFF18_expo4.jpg',
  'OFF18_expo5.jpg',
  'OFF18_expo6.jpg',
  
  // RampGallery
  'REDIRECT_1.jpg',
  'REDIRECT_2.jpg',
  'REDIRECT_3.jpg',
  'REDIRECT_4.jpg',
  'REDIRECT_5.jpg',
  'REDIRECT_6.jpg',
  
  // GroupRvcc
  '2022_FIREWALL_RVC-05.png',
  '2022_FIREWALL_RVC-04.png',
  '2022_FIREWALL_RVC-07.png',
  '2022_FIREWALL_RVC-08.png',
  '2022_FIREWALL_RVC-06.png',
  '2022_FIREWALL_RVC-01.png',
  
  // SerendipityAus
  'StPolten3.jpg',
  'StPolten1.jpg',
  'StPolten2.jpg',
  'StPolten5.jpg',
  
  // CreativeHack
  'FIREWALLCreativeHactivism2.19-8.jpg',
  'FIREWALLCreativeHactivism2.19-5.jpg',
  'FIREWALLCreativeHactivism2.19-4.jpg',
  'FIREWALLCreativeHactivism2.19-2.jpg',
  
  // OsloTaiwan
  '2022_FIREWALL_OFF_TW-02.png',
  '2022_FIREWALL_OFF_TW-04.png',
  '2022_FIREWALL_OFF_TW-07.png',
  '2022_FIREWALL_OFF_TW-08.png',
  '2022_FIREWALL_OFF_TW-05.png',
  '2022_FIREWALL_OFF_TW-06.jpg',
  
  // Megha
  'FWC_POU_1.jpg',
  'FWC_POU_2.jpg',
  'FWC_POU_3.jpg',
  'FWC_POU_4.jpg',
  'FWC_POU_5.jpg',
  'FWC_POU_6.jpg',
  'FWC_POU_7.jpg',
  'FWC_POU_8.jpg',
  'FWC_POU_9.jpg',
  'FWC_POU_10.jpg',
  
  // BorderControl
  '1_FWC_NMC_-7626.jpg',
  '2_NMC_CoCreatingBorder-7512.jpg',
  '3_FWC_NMC_-7601.jpg',
  '4_FWC_NMC_-7632.jpg',
  '5_FWC_NMC_-7615.jpg',
  
  // ApexYouth
  'FIREWALLApex-49.jpg',
  'FIREWALLApex-47.jpg',
  'FIREWALLApex-41.jpg',
  'FIREWALLApex-25.jpg',
  'FIREWALLApex-22.jpg',
  
  // ProxyPals
  'FIREWALLuProxy2.18-1.jpg',
  'FIREWALLuProxy2.18-2.jpg',
  'FIREWALLuProxy2.18-3-1.jpg',
  
  // OsloMiami
  '2021_FIREWALL_OFF_MIA-31-copy.jpg',
  '2021_FIREWALL_OFF_MIA-31-copy-4.jpg',
  '2021_FIREWALL_OFF_MIA-25-copy.jpg',
  '2021_FIREWALL_OFF_MIA-31-copy-1.jpg',
  
  // HongKongNotFound
  'Firewall_HK_1920.jpg',
  'Firewall_HK5_1920-1.jpg',
  'Firewall_HK6_1920-950x629-1.jpg',
  
  // Reactions
  'VBKO_Panel-2-of-4.jpg',
  'VBKO_Panel-4-of-4.jpg',
  'A6_Flyer_SearchforFeminism_FINAL-back.jpg',
  
  // NetworkedFem
  'Feminism_panel_edit.jpg',
  'Feminism_audience_edit.jpg',
  'Feminism_Susan_edit.jpg',
  'Feminism_Mingming_edit.jpg',

  // FeaturedBbc
  'BBC.png',
  
];

function checkFileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

async function checkImageExists(imageName) {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: `images/${imageName}`
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

async function uploadImage(imageName, dryRun = false, skipExisting = true, progressBar = null) {
  const filePath = path.join(__dirname, '../public/images', imageName);
  
  // Check if file exists locally
  if (!checkFileExists(filePath)) {
    console.error(`\nError: File ${imageName} not found at ${filePath}`);
    if (progressBar) progressBar.increment();
    return null;
  }

  // Check if image already exists in bucket
  if (skipExisting && !dryRun) {
    const exists = await checkImageExists(imageName);
    if (exists) {
      console.log(`\nSkipping ${imageName} - already exists in bucket`);
      if (progressBar) progressBar.increment();
      return `https://${bucketName}.nyc3.digitaloceanspaces.com/images/${imageName}`;
    }
  }

  if (dryRun) {
    const exists = await checkImageExists(imageName);
    console.log(`\n[DRY RUN] ${imageName} - ${exists ? 'EXISTS' : 'NEW'}`);
    if (progressBar) progressBar.increment();
    return `https://${bucketName}.nyc3.digitaloceanspaces.com/images/${imageName}`;
  }
  
  try {
    const fileContent = fs.readFileSync(filePath);
    
    // Determine content type based on file extension
    const contentType = imageName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    const params = {
      Bucket: bucketName,
      Key: `images/${imageName}`,
      Body: fileContent,
      ACL: 'public-read',
      ContentType: contentType
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const location = `https://${bucketName}.nyc3.digitaloceanspaces.com/images/${imageName}`;
    console.log(`\nSuccessfully uploaded ${imageName} to ${location}`);
    if (progressBar) progressBar.increment();
    return location;
  } catch (error) {
    console.error(`\nError uploading ${imageName}:`, error);
    if (progressBar) progressBar.increment();
    throw error;
  }
}

async function uploadAllImages(dryRun = false, skipExisting = true) {
  if (dryRun) {
    console.log('=== DRY RUN MODE ===');
    console.log('Checking files and showing what would be uploaded:');
  } else if (skipExisting) {
    console.log('=== SKIP EXISTING MODE ===');
    console.log('Skipping files that already exist in the bucket:');
  }

  // Create progress bar
  const progressBar = createProgressBar(images.length);

  try {
    const results = await Promise.all(images.map(img => uploadImage(img, dryRun, skipExisting, progressBar)));
    progressBar.stop();
    const successfulUploads = results.filter(url => url !== null);
    
    if (dryRun) {
      console.log('\n=== DRY RUN SUMMARY ===');
      console.log(`Found ${successfulUploads.length} of ${images.length} files`);
      console.log('Would upload to URLs:');
      successfulUploads.forEach(url => console.log(url));
    } else {
      console.log('\n=== UPLOAD SUMMARY ===');
      console.log(`Processed ${successfulUploads.length} of ${images.length} files`);
      if (skipExisting) {
        console.log('(Some files may have been skipped as they already exist)');
      }
      console.log('URLs:', successfulUploads);
    }
  } catch (error) {
    progressBar.stop();
    console.error('\nError:', error);
  }
}

// Check command line flags
const dryRun = process.argv.includes('--dry-run');
const skipExisting = process.argv.includes('--skip-existing');

uploadAllImages(dryRun, skipExisting); 