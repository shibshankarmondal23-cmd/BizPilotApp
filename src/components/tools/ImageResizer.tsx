import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Upload, Download, RotateCcw, Lock, Unlock, Shield, Check, AlertCircle } from 'lucide-react';

interface Props {
  onNotify?: (msg: string) => void;
}

export const ImageResizer: React.FC<Props> = ({ onNotify }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [fileType, setFileType] = useState<string>('image/png');
  const [fileSize, setFileSize] = useState<number>(0);

  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  const [targetWidth, setTargetWidth] = useState<string>('');
  const [targetHeight, setTargetHeight] = useState<string>('');
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState<number>(90);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [downloadSize, setDownloadSize] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Load image from file
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      if (onNotify) onNotify('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setFileType(file.type);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imgElementRef.current = img;
        setOriginalWidth(img.naturalWidth);
        setOriginalHeight(img.naturalHeight);
        setTargetWidth(img.naturalWidth.toString());
        setTargetHeight(img.naturalHeight.toString());
        setImageSrc(result);
        if (onNotify) onNotify(`Loaded "${file.name}" (${img.naturalWidth} × ${img.naturalHeight}px)`);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Width change
  const handleWidthChange = (val: string) => {
    setTargetWidth(val);
    const num = parseInt(val, 10);
    if (lockAspectRatio && originalWidth > 0 && originalHeight > 0 && !isNaN(num) && num > 0) {
      const calculatedHeight = Math.round((num / originalWidth) * originalHeight);
      setTargetHeight(calculatedHeight.toString());
    }
  };

  // Height change
  const handleHeightChange = (val: string) => {
    setTargetHeight(val);
    const num = parseInt(val, 10);
    if (lockAspectRatio && originalWidth > 0 && originalHeight > 0 && !isNaN(num) && num > 0) {
      const calculatedWidth = Math.round((num / originalHeight) * originalWidth);
      setTargetWidth(calculatedWidth.toString());
    }
  };

  // Preset percentage scale
  const applyPresetScale = (scale: number) => {
    if (originalWidth > 0 && originalHeight > 0) {
      const w = Math.round(originalWidth * scale);
      const h = Math.round(originalHeight * scale);
      setTargetWidth(w.toString());
      setTargetHeight(h.toString());
    }
  };

  // Reset tool
  const handleReset = () => {
    setImageSrc(null);
    setPreviewBlobUrl(null);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setTargetWidth('');
    setTargetHeight('');
    setDownloadSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onNotify) onNotify('Image resizer reset');
  };

  // Generate resized blob locally via Canvas
  const generateResizedImage = (): Promise<{ blob: Blob; url: string } | null> => {
    return new Promise((resolve) => {
      if (!imgElementRef.current) {
        resolve(null);
        return;
      }

      const w = parseInt(targetWidth, 10);
      const h = parseInt(targetHeight, 10);

      // Guard against invalid values or excessively large dimensions that crash browser canvas
      if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0 || w > 10000 || h > 10000) {
        resolve(null);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(null);
        return;
      }

      // High-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(imgElementRef.current, 0, 0, w, h);

      const qual = outputFormat === 'image/jpeg' || outputFormat === 'image/webp' ? quality / 100 : undefined;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          const url = URL.createObjectURL(blob);
          resolve({ blob, url });
        },
        outputFormat,
        qual
      );
    });
  };

  // Cleanup object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  // Re-generate preview when dimensions or format change
  useEffect(() => {
    if (!imageSrc) return;

    const timer = setTimeout(async () => {
      const res = await generateResizedImage();
      if (res) {
        setPreviewBlobUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return res.url;
        });
        setDownloadSize(res.blob.size);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [targetWidth, targetHeight, outputFormat, quality, imageSrc]);

  // Handle Download
  const handleDownload = async () => {
    setIsProcessing(true);
    const res = await generateResizedImage();
    setIsProcessing(false);

    if (!res) {
      if (onNotify) onNotify('Failed to process image. Please check width and height values (max 10,000px).');
      return;
    }

    const extension = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const finalFilename = `${fileName}-resized-${targetWidth}x${targetHeight}.${extension}`;

    const link = document.createElement('a');
    link.href = res.url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up temporary download object URL after download trigger
    setTimeout(() => {
      URL.revokeObjectURL(res.url);
    }, 2000);

    if (onNotify) onNotify(`Downloaded "${finalFilename}" successfully!`);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div id="image-resizer-tool" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Local Image Resizer</h3>
            <p className="text-sm text-slate-500">Quickly resize images directly in your browser without uploading to any server</p>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-lg self-start sm:self-auto font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Private (No server upload)</span>
        </div>
      </div>

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        id="image-file-input"
      />

      {!imageSrc ? (
        /* Upload Drag & Drop Box */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-6 border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">
            Choose an image or drag &amp; drop here
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Supports JPG, PNG, WEBP, and GIF. Images are processed locally on your device and are never sent over the web.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Select Image from Device
          </button>
        </div>
      ) : (
        /* Image Resizer Workspace */
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Original: {originalWidth} × {originalHeight}px ({formatBytes(fileSize)})
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Change Image
              </button>
            </div>

            {/* Dimensions Inputs */}
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="target-width-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Width (px)
                </label>
                <input
                  id="target-width-input"
                  type="number"
                  min="1"
                  max="10000"
                  value={targetWidth}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-mono"
                />
              </div>

              <div>
                <label htmlFor="target-height-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Height (px)
                </label>
                <input
                  id="target-height-input"
                  type="number"
                  min="1"
                  max="10000"
                  value={targetHeight}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-mono"
                />
              </div>
            </div>

            {/* Lock Aspect Ratio Toggle */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2">
                {lockAspectRatio ? (
                  <Lock className="w-4 h-4 text-blue-600" />
                ) : (
                  <Unlock className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs font-medium text-slate-700">Lock Aspect Ratio</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lockAspectRatio}
                  onChange={(e) => setLockAspectRatio(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Quick Scale Presets */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                Quick Scale Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '25%', factor: 0.25 },
                  { label: '50%', factor: 0.5 },
                  { label: '75%', factor: 0.75 },
                  { label: 'Original (100%)', factor: 1.0 },
                  { label: '200% (2x)', factor: 2.0 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => applyPresetScale(item.factor)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Format & Quality */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="output-format-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Format
                </label>
                <select
                  id="output-format-select"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white font-medium"
                >
                  <option value="image/png">PNG (Lossless)</option>
                  <option value="image/jpeg">JPEG (Compressed)</option>
                  <option value="image/webp">WEBP (Modern Web)</option>
                </select>
              </div>

              {(outputFormat === 'image/jpeg' || outputFormat === 'image/webp') && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="quality-slider" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Quality: {quality}%
                    </label>
                  </div>
                  <input
                    id="quality-slider"
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 cursor-pointer mt-2"
                  />
                </div>
              )}
            </div>

            {/* Download CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isProcessing || !targetWidth || !targetHeight}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Resized Image ({targetWidth} × {targetHeight}px)
              </button>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-200/60 min-h-[260px]">
            {previewBlobUrl ? (
              <div className="flex flex-col items-center max-w-full">
                <div className="max-h-[260px] overflow-hidden rounded-lg shadow-sm border border-slate-200 bg-white p-1">
                  <img
                    src={previewBlobUrl}
                    alt="Resized preview"
                    className="max-h-[240px] w-auto object-contain rounded"
                  />
                </div>
                <div className="text-xs text-slate-500 mt-3 font-medium flex items-center gap-2">
                  <span>Output size: ~{formatBytes(downloadSize)}</span>
                  <span>•</span>
                  <span>{targetWidth} × {targetHeight}px</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">Loading preview...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
