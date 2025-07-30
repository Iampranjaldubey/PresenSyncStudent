import React, { useState, useEffect } from 'react';
import { X, Camera, MapPin, CheckCircle, AlertCircle, Eye } from 'lucide-react';

const QRScanner = ({ onScanSuccess, onClose, sessions }) => {
  const [step, setStep] = useState('camera'); // camera, qr, location, face, success
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [faceVerificationResult, setFaceVerificationResult] = useState(null);

  // Mock QR codes for demo
  const mockQRCodes = sessions.filter(s => s.canCheckIn).map(s => s.qrCode);

  useEffect(() => {
    // Start camera when component mounts
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      // Simulate camera access - in a real implementation, you would access the camera here
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera simulation started');
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    // In a real implementation, you would stop the camera stream here
    console.log('Camera simulation stopped');
  };

  const simulateQRScan = async () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate finding a valid QR code
    const randomQR = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
    setScanResult(randomQR);
    setIsScanning(false);
    setStep('location');
  };

  const requestLocation = async () => {
    setLocationError(null);
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      // Request location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocation(coords);
          setStep('face');
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied. Please enable location services and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          setLocationError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } catch (error) {
      setLocationError(error.message);
    }
  };

  const simulateFaceVerification = async () => {
    // Simulate face verification process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 90% success rate for demo
    const success = Math.random() > 0.1;
    setFaceVerificationResult(success);
    
    if (success) {
      setStep('success');
      // Complete the attendance marking process
      setTimeout(() => {
        const matchedSession = sessions.find(s => s.qrCode === scanResult);
        if (matchedSession) {
          onScanSuccess(matchedSession.id, scanResult, location, true);
        }
      }, 2000);
    }
  };

  const retryFaceVerification = () => {
    setFaceVerificationResult(null);
    simulateFaceVerification();
  };

  const skipLocationVerification = () => {
    setStep('face');
  };

  const renderCameraView = () => (
    <div className="relative h-full">
      <div className="relative h-80 bg-gray-900 rounded-lg overflow-hidden">
        {/* Mock camera view */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-sm opacity-75">Camera View</p>
            <p className="text-xs opacity-50 mt-1">(Simulated for demo)</p>
          </div>
        </div>
        
        {/* QR Code Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border-2 border-white rounded-lg opacity-50">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400"></div>
          </div>
        </div>

        {isScanning && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="spinner w-8 h-8 mx-auto mb-2 border-white border-t-blue-400"></div>
              <p>Scanning QR Code...</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-4">
          Position the QR code within the frame to scan
        </p>
        <button
          onClick={simulateQRScan}
          disabled={isScanning}
          className="btn-primary touch-manipulation"
        >
          {isScanning ? 'Scanning...' : 'Simulate QR Scan'}
        </button>
      </div>
    </div>
  );

  const renderLocationView = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPin className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Location Verification
      </h3>
      <p className="text-gray-600 mb-6">
        We need to verify your location to ensure you're attending class from the correct location.
      </p>

      {locationError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm text-red-800 font-medium">Location Error</p>
              <p className="text-sm text-red-600 mt-1">{locationError}</p>
            </div>
          </div>
        </div>
      ) : location ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-sm text-green-800 font-medium">Location verified successfully</p>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <button
          onClick={requestLocation}
          className="btn-primary w-full touch-manipulation"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Allow Location Access
        </button>
        <button
          onClick={skipLocationVerification}
          className="btn-secondary w-full touch-manipulation"
        >
          Skip Location Verification
        </button>
      </div>
    </div>
  );

  const renderFaceVerificationView = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Eye className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Face Verification
      </h3>
      <p className="text-gray-600 mb-6">
        Please look at the camera for face verification to complete your attendance.
      </p>

      {/* Mock face detection area */}
      <div className="relative w-48 h-48 mx-auto mb-6 bg-gray-100 rounded-full overflow-hidden border-4 border-blue-200">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
          {faceVerificationResult === null ? (
            <div className="text-center">
              <div className="spinner w-8 h-8 mx-auto mb-2 border-blue-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-600">Detecting face...</p>
            </div>
          ) : faceVerificationResult ? (
            <div className="text-center text-green-600">
              <CheckCircle className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-medium">Verified!</p>
            </div>
          ) : (
            <div className="text-center text-red-600">
              <AlertCircle className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-medium">Verification failed</p>
            </div>
          )}
        </div>
      </div>

      {faceVerificationResult === null ? (
        <button
          onClick={simulateFaceVerification}
          className="btn-primary touch-manipulation"
        >
          Start Face Verification
        </button>
      ) : faceVerificationResult ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">Face verification completed successfully!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">Face verification failed. Please try again.</p>
          </div>
          <button
            onClick={retryFaceVerification}
            className="btn-primary touch-manipulation"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );

  const renderSuccessView = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Attendance Marked!
      </h3>
      <p className="text-gray-600 mb-6">
        Your attendance has been successfully recorded.
      </p>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-sm text-green-800">
          <p className="font-medium">Verification Summary:</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <span>QR Code:</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <span>Location:</span>
              {location ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs">Skipped</span>}
            </div>
            <div className="flex items-center justify-between">
              <span>Face Verification:</span>
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 'camera':
      case 'qr':
        return renderCameraView();
      case 'location':
        return renderLocationView();
      case 'face':
        return renderFaceVerificationView();
      case 'success':
        return renderSuccessView();
      default:
        return renderCameraView();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Mark Attendance
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              ['qr', 'location', 'face', 'success'].includes(step) 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white'
            }`}>
              1
            </div>
            <div className={`w-8 h-1 ${
              ['location', 'face', 'success'].includes(step) ? 'bg-green-600' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              ['face', 'success'].includes(step) 
                ? 'bg-green-600 text-white' 
                : step === 'location' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-8 h-1 ${
              ['success'].includes(step) ? 'bg-green-600' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step === 'success' 
                ? 'bg-green-600 text-white' 
                : step === 'face' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;