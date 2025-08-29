import { useState, useEffect } from "react";
import { Download, RefreshCw, Image, Copy } from "lucide-react";

const ImageGenerator = () => {
  const [selectedSize, setSelectedSize] = useState({ width: 800, height: 600 });
  const [customSize, setCustomSize] = useState({ width: "", height: "" });
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageId, setImageId] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState("");

  const predefinedSizes = [
    { label: "Square Small", width: 300, height: 300 },
    { label: "Square Medium", width: 500, height: 500 },
    { label: "Square Large", width: 800, height: 800 },
    { label: "Landscape Small", width: 640, height: 480 },
    { label: "Landscape Medium", width: 800, height: 600 },
    { label: "Landscape Large", width: 1200, height: 800 },
    { label: "Portrait Small", width: 480, height: 640 },
    { label: "Portrait Medium", width: 600, height: 800 },
    { label: "Portrait Large", width: 800, height: 1200 },
    { label: "Wide Banner", width: 1200, height: 400 },
    { label: "Social Media", width: 1080, height: 1080 },
  ];

  const generateImage = () => {
    setIsLoading(true);
    setImageUrl("");
    setError("");

    const width = isCustomSize
      ? parseInt(customSize.width) || 800
      : selectedSize.width;
    const height = isCustomSize
      ? parseInt(customSize.height) || 600
      : selectedSize.height;

    const randomId = Math.floor(Math.random() * 1000) + 1;
    setImageId(randomId);

    const url = `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
    console.log("Generated URL:", url);

    setTimeout(() => {
      setImageUrl(url);
      setIsLoading(false);
    }, 2000);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setIsCustomSize(false);
  };

  const handleCustomSizeToggle = () => {
    setIsCustomSize(!isCustomSize);
    if (!isCustomSize) {
      setCustomSize({
        width: selectedSize.width.toString(),
        height: selectedSize.height.toString(),
      });
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${selectedSize.width}x${selectedSize.height}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const copyUrlToClipboard = async () => {
    if (!imageUrl) return;

    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  useEffect(() => {
    generateImage();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Image Generator
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate high-quality placeholder images with customizable
            dimensions. Perfect for mockups, prototypes, and design projects.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Size Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Image Dimensions
              </h3>

              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Predefined Sizes
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {predefinedSizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => handleSizeSelect(size)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        !isCustomSize &&
                        selectedSize.width === size.width &&
                        selectedSize.height === size.height
                          ? "bg-indigo-100 border-2 border-indigo-500 text-indigo-700"
                          : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="font-medium text-sm">{size.label}</div>
                      <div className="text-xs text-gray-500">
                        {size.width} × {size.height}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={handleCustomSizeToggle}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    isCustomSize
                      ? "bg-indigo-100 border-2 border-indigo-500 text-indigo-700"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="font-medium text-sm">Custom Size</div>
                  <div className="text-xs text-gray-500">
                    Enter your own dimensions
                  </div>
                </button>
              </div>

              {isCustomSize && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        value={customSize.width}
                        onChange={(e) =>
                          setCustomSize({
                            ...customSize,
                            width: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="800"
                        min="50"
                        max="2000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        value={customSize.height}
                        onChange={(e) =>
                          setCustomSize({
                            ...customSize,
                            height: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="600"
                        min="50"
                        max="2000"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={generateImage}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  {isLoading ? "Generating..." : "Generate New Image"}
                </button>

                {imageUrl && (
                  <>
                    <button
                      onClick={downloadImage}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Image
                    </button>

                    <button
                      onClick={copyUrlToClipboard}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                        copySuccess
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                      {copySuccess ? "Copied!" : "Copy URL"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {imageUrl && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Image Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium">
                      {isCustomSize
                        ? `${customSize.width || 800}×${
                            customSize.height || 600
                          }`
                        : `${selectedSize.width}×${selectedSize.height}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">JPEG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Source:</span>
                    <span className="font-medium">Lorem Picsum</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Generated Image
                </h3>
                <div className="text-sm text-gray-500">
                  {isCustomSize
                    ? `${customSize.width || 800}×${
                        customSize.height || 600
                      } px`
                    : `${selectedSize.width}×${selectedSize.height} px`}
                </div>
              </div>

              <div
                className="relative bg-gray-50 rounded-lg overflow-hidden"
                style={{ minHeight: "400px" }}
              >
                {/* Error Display */}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200">
                      <div className="text-red-600 mb-2">⚠️ Error</div>
                      <p className="text-red-700">{error}</p>
                      <button
                        onClick={generateImage}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}

                {isLoading && !error ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
                      <p className="text-gray-600">Generating image...</p>
                    </div>
                  </div>
                ) : imageUrl && !error ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img
                      src={imageUrl}
                      alt={`Generated placeholder image ${
                        isCustomSize
                          ? `${customSize.width}×${customSize.height}`
                          : `${selectedSize.width}×${selectedSize.height}`
                      }`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                      style={{
                        maxHeight: "70vh",
                        width: "auto",
                        height: "auto",
                      }}
                      onLoad={() => {
                        setIsLoading(false);
                        console.log("Image loaded successfully:", imageUrl);
                      }}
                      onError={(e) => {
                        setIsLoading(false);
                        setError("Failed to load image. Please try again.");
                        console.error("Image failed to load:", imageUrl);
                        console.error("Error details:", e);
                      }}
                    />
                  </div>
                ) : !error ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Click "Generate New Image" to create an image</p>
                    </div>
                  </div>
                ) : null}
              </div>

              {imageUrl && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-mono"
                    />
                    <button
                      onClick={copyUrlToClipboard}
                      className={`px-3 py-2 rounded-md text-sm transition-colors ${
                        copySuccess
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Images provided by{" "}
            <a
              href="https://picsum.photos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Lorem Picsum
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
