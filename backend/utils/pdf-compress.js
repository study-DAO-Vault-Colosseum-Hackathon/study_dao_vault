const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('node:path');

/**
 * Compresses a PDF using Ghostscript and only keeps the output if smaller.
 * @param {string} inputPath - Path to the input PDF.
 * @param {string} outputPath - Path to save the compressed PDF.
 * @param {"screen" | "ebook" | "printer" | "prepress"} [quality="screen"] - Compression preset.
 * @returns {Promise<{usedCompressed:boolean, originalBytes:number, compressedBytes:number, outputPath:string}>}
 */
async function compressPDF(inputPath, outputPath, quality = 'screen') {
  const presetMap = {
    screen: '/screen',
    ebook: '/ebook',
    printer: '/printer',
    prepress: '/prepress',
  };
  const resolutionMap = {
    screen: 72,
    ebook: 120,
    printer: 150,
    prepress: 300,
  };
  const selectedQuality = presetMap[quality] ? quality : 'screen';
  const pdfSetting = presetMap[selectedQuality];
  const imageResolution = resolutionMap[selectedQuality];

  const tempOutputPath = `${outputPath}.tmp`;
  const gsArgs = [
    '-sDEVICE=pdfwrite',
    '-dCompatibilityLevel=1.4',
    `-dPDFSETTINGS=${pdfSetting}`,
    // Force image downsampling and duplicate detection for stronger size reduction.
    '-dDetectDuplicateImages=true',
    '-dCompressFonts=true',
    '-dSubsetFonts=true',
    '-dDownsampleColorImages=true',
    '-dDownsampleGrayImages=true',
    '-dDownsampleMonoImages=true',
    `-dColorImageResolution=${imageResolution}`,
    `-dGrayImageResolution=${imageResolution}`,
    `-dMonoImageResolution=${Math.max(72, Math.floor(imageResolution / 2))}`,
    '-dNOPAUSE',
    '-dQUIET',
    '-dBATCH',
    `-sOutputFile=${tempOutputPath}`,
    inputPath,
  ];

  const runGhostscript = (command) =>
    new Promise((resolve, reject) => {
      const child = spawn(command, gsArgs, { windowsHide: true });
      let stderr = '';

      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
      });

      child.on('error', (error) => reject(error));
      child.on('close', (code) => {
        if (code === 0) return resolve();
        return reject(new Error(stderr || `Ghostscript exited with code ${code}`));
      });
    });

  try {
    const defaultCommand = process.platform === 'win32' ? 'gswin64c' : 'gs';
    await runGhostscript(defaultCommand);
  } catch (firstError) {
    if (process.platform !== 'win32') {
      throw firstError;
    }

    const fallbackPath = process.env.GS_CMD || 'C:\\Program Files\\gs\\gs10.07.0\\bin\\gswin64c.exe';
    await runGhostscript(fallbackPath);
  }

  const [inputStat, tempStat] = await Promise.all([fs.stat(inputPath), fs.stat(tempOutputPath)]);

  if (tempStat.size < inputStat.size) {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.rename(tempOutputPath, outputPath);
    return {
      usedCompressed: true,
      originalBytes: inputStat.size,
      compressedBytes: tempStat.size,
      outputPath,
    };
  }

  await fs.copyFile(inputPath, outputPath);
  await fs.unlink(tempOutputPath);
  return {
    usedCompressed: false,
    originalBytes: inputStat.size,
    compressedBytes: inputStat.size,
    outputPath,
  };
}

module.exports = { compressPDF };