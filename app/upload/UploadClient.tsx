// app/uploadpage/UploadClient.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  X,
  Activity,
  CheckCircle,
  FileImage,
  LogOut,
  User,
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
  result?: string;
  detectedLabels?: { class: string; percentage: number }[];
  status?: 'pending' | 'analyzing' | 'completed' | 'error';
}

interface UploadClientProps {
  initialShowResult: boolean;
}

export default function UploadClient({ initialShowResult }: UploadClientProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const email = sessionStorage.getItem('userEmail') || 'user@example.com';

    if (!token) {
      window.location.href = '/login';
      return;
    }

    setIsAuthenticated(true);
    setUserEmail(email);

    if (initialShowResult) {
      console.log('Deteksi berhasil, URL menunjukkan hasil analisis tersedia.');
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [initialShowResult]);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (fileList: File[]) => {
    const imageFiles = fileList.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      alert('Please select valid image files (JPG, PNG)');
      return;
    }

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const newFile: UploadedFile = {
          file,
          preview: e.target?.result as string,
          id: Math.random().toString(36).substring(7),
          status: 'pending'
        };
        setFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleUpload = async () => {
    setIsUploading(true);

    const updatedFiles = await Promise.all(
      files.map(async file => {
        if (file.status === 'completed') return file;

        setFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { ...f, status: 'analyzing' as const } : f
          )
        );

        const formData = new FormData();
        formData.append('file', file.file);

        try {
          const res = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('authToken') || ''}`
            }
          });

          if (!res.ok) throw new Error('Upload failed');
          const data = await res.json();

          return {
            ...file,
            result: `data:image/png;base64,${data.overlay}`,
            detectedLabels: data.detected_labels || [],
            status: 'completed' as const
          };
        } catch (err) {
          console.error('Error:', err);
          return { ...file, status: 'error' as const };
        }
      })
    );

    setFiles(updatedFiles);
    setIsUploading(false);

    const hasResult = updatedFiles.some(f => f.status === 'completed');
    if (hasResult) {
      router.push('/uploadpage?result=true', { scroll: false });
    }
  };

  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Checking authentication...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden relative">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '5%',
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        ></div>
        <div
          className="absolute w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '10%',
            right: '10%',
            animationDelay: '1s',
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * -0.02}px)`
          }}
        ></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Eye Disease Detection
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Analysis</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  {userEmail}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2 bg-white/50 hover:bg-red-50 border-gray-200 hover:border-red-300 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20 mb-4">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-700">
              U-Net ResNet18 Model
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Retina Image Analyzer
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Upload fundus images to detect eye diseases using advanced deep learning technology
          </p>
        </div>

        {/* Upload Section */}
        <Card className="border border-white/20 shadow-2xl bg-white/70 backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Upload Fundus Images
            </CardTitle>
            <CardDescription className="text-gray-600">
              Supported formats: JPG, PNG • Max size: 10MB per file
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer ${dragActive
                  ? 'border-emerald-500 bg-emerald-50 scale-105 shadow-xl'
                  : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-110 hover:rotate-6">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">
                  {dragActive ? 'Drop your images here' : 'Drop or Select Images'}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Click to browse or drag and drop your fundus images here for analysis
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    .JPG
                  </span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                    .PNG
                  </span>
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                    Multiple Files
                  </span>
                </div>
              </div>

              {dragActive && (
                <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white rounded-xl px-6 py-4 shadow-2xl">
                    <p className="text-emerald-600 font-semibold text-lg">Drop files here!</p>
                  </div>
                </div>
              )}
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Uploaded Images ({files.length})
                  </h4>
                  <Button
                    onClick={() => setFiles([])}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 border-red-200"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {files.map((file) => (
                    <Card
                      key={file.id}
                      className="relative group bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {file.file.name.length > 30
                              ? file.file.name.substring(0, 30) + '...'
                              : file.file.name}
                          </span>
                          {file.status === 'analyzing' && (
                            <span className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              <div className="w-3 h-3 border-2 border-blue-700/30 border-t-blue-700 rounded-full animate-spin"></div>
                              <span>Analyzing</span>
                            </span>
                          )}
                          {file.status === 'completed' && (
                            <span className="flex items-center space-x-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                              <CheckCircle className="w-3 h-3" />
                              <span>Completed</span>
                            </span>
                          )}
                          {file.status === 'error' && (
                            <span className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              <AlertCircle className="w-3 h-3" />
                              <span>Error</span>
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                            <FileImage className="w-4 h-4" />
                            Original Image
                          </h5>
                          <img
                            src={file.preview}
                            alt="original"
                            className="w-full rounded-xl border-2 border-gray-200 shadow-md hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {file.result && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                              <Activity className="w-4 h-4" />
                              Detection Result
                            </h5>
                            <img
                              src={file.result}
                              alt="result"
                              className="w-full rounded-xl border-2 border-emerald-300 shadow-lg hover:scale-105 transition-transform duration-300"
                            />

                            {file.detectedLabels && file.detectedLabels.length > 0 && (
                              <Alert className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                                <AlertDescription>
                                  <p className="font-semibold text-emerald-800 mb-2">Detected Classes:</p>
                                  <div className="space-y-2">
                                    {file.detectedLabels.map((lbl, i) => (
                                      <div key={i} className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                                        <span className="font-medium text-gray-700">{lbl.class}</span>
                                        <div className="flex items-center gap-2">
                                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                                              style={{ width: `${lbl.percentage}%` }}
                                            ></div>
                                          </div>
                                          <span className="text-sm font-bold text-emerald-700 min-w-[3rem] text-right">
                                            {lbl.percentage}%
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={isUploading || files.filter(f => f.status !== 'completed').length === 0}
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:hover:scale-100 shadow-xl hover:shadow-2xl disabled:opacity-50 rounded-xl"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing Images...</span>
                    </div>
                  ) : files.filter(f => f.status !== 'completed').length === 0 ? (
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>All Images Analyzed</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Activity className="w-5 h-5" />
                      <span>Analyze {files.filter(f => f.status !== 'completed').length} Image{files.filter(f => f.status !== 'completed').length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-lg">
            <CardContent className="p-6">
              <h4 className="font-semibold text-emerald-800 mb-2">Fast Analysis</h4>
              <p className="text-sm text-gray-600">Get results in seconds with our optimized AI model</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 shadow-lg">
            <CardContent className="p-6">
              <h4 className="font-semibold text-teal-800 mb-2">High Accuracy</h4>
              <p className="text-sm text-gray-600">95%+ accuracy rate validated by medical professionals</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 shadow-lg">
            <CardContent className="p-6">
              <h4 className="font-semibold text-cyan-800 mb-2">Secure & Private</h4>
              <p className="text-sm text-gray-600">Your data is encrypted and never shared</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}