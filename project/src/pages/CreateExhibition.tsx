// src/pages/CreateExhibition.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Upload,
  X,
  Palette,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react';
import { ExhibitionData, Artwork } from '../types/exhibition';
import Header from '../components/Header';
import NavigationWarningModal from '../components/NavigationWarningModal';
import ErrorToast from '../components/ErrorToast';

import { storage, functions } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';

/* ──────────────────────────────────────────────────────────── */
/* helpers                                                     */
/* ──────────────────────────────────────────────────────────── */

/** cloud-function that returns something like "2025-06-24T09-32-57-767" */
const getServerTime = httpsCallable(functions, 'GetServerTimeFileNameFormat');
/** cloud-function we need to invoke right before navigating away */
const setRoomWaiting = httpsCallable(functions, 'SetRoomWaitingV2Call');

/** 16-character random [A-Za-z0-9] */
const randomString = (len = 16): string => {
  const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  while (out.length < len) out += pool[Math.random() * pool.length | 0];
  return out;
};

/** fix extension (jpeg → .jpg, keep lowercase, add leading '.') */
const correctedExt = (name: string): string => {
  let ext = name.split('.').pop() ?? '';
  ext = ext.toLowerCase() === 'jpeg' ? 'jpg' : ext.toLowerCase();
  return `.${ext}`;
};

/**
 * Turn a Firebase **download URL** (the one we get from getDownloadURL)
 * into the raw storage path that the backend expects, e.g.
 *
 *   https://firebasestorage.googleapis.com/v0/b/…/o/RoomGenerator%2FEditorQuickFormV2%2F…%2F1.jpg
 *              ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
 *                      RoomGenerator/EditorQuickFormV2/…/1.jpg
 */
const storagePathFromDownloadUrl = (downloadUrl: string): string => {
  try {
    // 1. Decode %2F ➜ '/'
    const decoded = decodeURIComponent(new URL(downloadUrl).pathname);

    //    decoded looks like:
    //    /v0/b/<bucket>/o/RoomGenerator/EditorQuickFormV2/2025-06/…/1.jpg
    const prefixMatch = decoded.match(/^\/v0\/b\/[^/]+\/o\//);
    if (!prefixMatch) return '';                   // unexpected, give empty path

    // 2. Strip the leading "/v0/b/<bucket>/o/"
    return decoded.slice(prefixMatch[0].length);
  } catch (err) {
    console.error('Failed to extract storage path:', err);
    return '';
  }
};

/* ──────────────────────────────────────────────────────────────
 *  memoised folder + sequential filenames
 * ──────────────────────────────────────────────────────────── */

const folderBaseRef = { current: '' };   // created once per session/run
const fileCounter   = { current: 0 };    // 1.jpg 2.jpg …

/** get (or lazily create) a base like "…/2025-06/2025-06-24T09-32-57-767_AbCd…/" */
async function getOrCreateFolderBase(): Promise<string> {
  if (folderBaseRef.current) return folderBaseRef.current;

  const snap = await getServerTime();
  const now  = snap.data as string;          // 2025-06-24T09-32-57-767
  const ym   = now.substring(0, 7);          // 2025-06
  const root = 'RoomGenerator/EditorQuickFormV2';

  folderBaseRef.current = `${root}/${ym}/${now}_${randomString()}/`;
  return folderBaseRef.current;
}

/** "…/logo.jpg" */
const logoPath = async () => `${await getOrCreateFolderBase()}logo.jpg`;
/** "…/1.jpg", "…/2.jpg", … */
async function nextArtworkPath(origName?: string): Promise<string> {
  const base = await getOrCreateFolderBase();
  fileCounter.current += 1;
  return `${base}${fileCounter.current}${correctedExt(origName ?? '')}`;
}

/** upload to Storage, return download-URL */
async function uploadToFirebaseStorage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/* ──────────────────────────────────────────────────────────── */
/* Frame & Color Helpers                                        */
/* ──────────────────────────────────────────────────────────── */

const colourMap: Record<string, string> = {
  'wood':        'wood08',
  'black-metal': 'black',
  'white-wood':  'white',
  'gold':        'wood05',
  'transparent': 'grey',
};

function deriveFrame(unit: 'cm' | 'inch', formFrame: string) {
  /* returns { frameType, depth, frameWidth } */
  const cm = unit === 'cm';
  switch (formFrame) {
    case 'framed':        // "standard-5cm"
      return { frameType: 'framed', depth: cm ? 5 : 2, frameWidth: cm ? 5 : 2 };
    case 'framed-thin':   // "standard-2_5cm"
      return { frameType: 'framed', depth: cm ? 2.5 : 1, frameWidth: cm ? 2.5 : 1 };
    default:              // stretched → "box-5cm"
      return { frameType: 'box',    depth: cm ? 5 : 2, frameWidth: 0 };
  }
}

/* ──────────────────────────────────────────────────────────── */
/* UI constants                                                */
/* ──────────────────────────────────────────────────────────── */

const frameTypes = [
  { id: 'framed',      label: 'Framed',      icon: '🖼️' },
  { id: 'framed-thin', label: 'Framed Thin', icon: '🖼️' },
  { id: 'stretched',   label: 'Stretched',   icon: '🎨' },
];

const frameColors = [
  { id: 'wood',        label: 'Wood',        color: '#8B4513' },
  { id: 'black-metal', label: 'Black Metal', color: '#2C2C2C' },
  { id: 'white-wood',  label: 'White Wood',  color: '#F5F5F5' },
  { id: 'gold',        label: 'Gold',        color: '#FFD700' },
  { id: 'transparent', label: 'Transparent', color: 'transparent', border: true },
];

interface ValidationError {
  field: string;
  message: string;
  elementRef?: React.RefObject<HTMLElement>;
  order: number;
  section: string;
}

/* ──────────────────────────────────────────────────────────── */
/*  component                                                  */
/* ──────────────────────────────────────────────────────────── */

const CreateExhibition: React.FC = () => {
  const navigate = useNavigate();

  /* ---------- state ---------------------------------------------------- */
  const [formData, setFormData] = useState<ExhibitionData>({
    exhibitionTitle: '',
    galleryName: '',
    galleryLogoUrl: null,
    artworks: [{
      id: '1',
      imageUrl: null,
      artistName: '',
      width: 0,
      height: 0,
      unit: 'cm',
      technique: '',
      year: new Date().getFullYear(),
      frameType: 'framed',
      frameColor: 'transparent', // Added default frame color
    }],
    userName: '',
    userEmail: '',
  });

  const [errors, setErrors]                     = useState<Record<string,string>>({});
  const [isSubmitting, setIsSubmitting]         = useState(false);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [hasUnsavedData, setHasUnsavedData]     = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [showErrorToast, setShowErrorToast]     = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [highlightedField, setHighlightedField] = useState<string|null>(null);
  const [uploadingImages, setUploadingImages]   = useState<Record<string,boolean>>({});

  /* ---------- refs ----------------------------------------------------- */
  const fileInputRefs      = useRef<Record<string,HTMLInputElement|null>>({});
  const artworkRefs        = useRef<Record<string,HTMLDivElement|null>>({});
  const artworkFieldRefs   = useRef<Record<string,HTMLElement|null>>({});
  const exhibitionTitleRef = useRef<HTMLInputElement>(null);
  const galleryNameRef     = useRef<HTMLInputElement>(null);
  const userNameRef        = useRef<HTMLInputElement>(null);
  const userEmailRef       = useRef<HTMLInputElement>(null);

  /* watch unsaved changes */
  useEffect(() => {
    const dirty =
      formData.exhibitionTitle.trim() !== '' ||
      formData.galleryName.trim()    !== '' ||
      formData.galleryLogoUrl        !== null ||
      formData.userName.trim()       !== '' ||
      formData.userEmail.trim()      !== '' ||
      formData.artworks.some(a =>
        a.imageUrl !== null ||
        a.artistName.trim() !== '' ||
        a.width  > 0 ||
        a.height > 0 ||
        a.technique.trim() !== '' ||
        a.year !== new Date().getFullYear()
      );
    setHasUnsavedData(dirty);
  }, [formData]);

  /* ---------- navigation guard ----------------------------------------- */
  const handleNavigateHome = () => setShowNavigationWarning(true);
  const confirmNavigation  = () => { setShowNavigationWarning(false); navigate('/'); };
  const cancelNavigation   = () => setShowNavigationWarning(false);

  /* ---------- generic field handler ------------------------------------ */
  const handleInputChange = (field: keyof ExhibitionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  /* ---------- artwork field handler ------------------------------------ */
  const handleArtworkChange = (idx: number, field: keyof Artwork, value: any) => {
    const updated = [...formData.artworks];
    updated[idx] = { ...updated[idx], [field]: value };

    if (field === 'width' && updated[idx].imagePreview) {
      const img = new Image();
      img.onload = () => {
        const ar = img.width / img.height;
        updated[idx].height = Math.round((value / ar) * 100) / 100;
        setFormData(prev => ({ ...prev, artworks: updated }));
      };
      img.src = updated[idx].imagePreview!;
    } else {
      setFormData(prev => ({ ...prev, artworks: updated }));
    }

    const errKey = `artwork-${idx}-${field}`;
    if (errors[errKey]) setErrors(prev => ({ ...prev, [errKey]: '' }));
  };

  /* ---------- uploads --------------------------------------------------- */
  const handleGalleryLogoUpload = async (file: File) => {
    const key = 'gallery-logo';
    setUploadingImages(prev => ({ ...prev, [key]: true }));
    try {
      const path = await logoPath();
      const url  = await uploadToFirebaseStorage(file, path);
      setFormData(prev => ({ ...prev, galleryLogoUrl: url }));
    } catch (err) {
      console.error(err);
      alert(`Failed to upload logo: ${(err as Error).message}`);
    } finally {
      setUploadingImages(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleImageUpload = async (idx: number, file: File) => {
    const artId = formData.artworks[idx].id;
    setUploadingImages(prev => ({ ...prev, [artId]: true }));
    try {
      const path = await nextArtworkPath(file.name);
      const url  = await uploadToFirebaseStorage(file, path);

      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const ar = img.width / img.height;
          const updated = [...formData.artworks];
          updated[idx] = {
            ...updated[idx],
            imageUrl: url,
            imagePreview: e.target?.result as string,
            width: updated[idx].width || 30,
            height: updated[idx].height || Math.round((30 / ar) * 100) / 100,
          };
          setFormData(prev => ({ ...prev, artworks: updated }));
          setUploadingImages(prev => ({ ...prev, [artId]: false }));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert(`Failed to upload image: ${(err as Error).message}`);
      setUploadingImages(prev => ({ ...prev, [artId]: false }));
    }
  };

  /* ---------- artwork add / remove ------------------------------------- */
  const addArtwork = () => {
    const newArt: Artwork = {
      id: Date.now().toString(),
      imageUrl: null,
      artistName: '',
      width: 0,
      height: 0,
      unit: 'cm',
      technique: '',
      year: new Date().getFullYear(),
      frameType: 'framed',
      frameColor: 'transparent', // Added default frame color
    };
    setFormData(prev => ({ ...prev, artworks: [...prev.artworks, newArt] }));
    setTimeout(() => artworkRefs.current[newArt.id]?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const removeArtwork = (idx: number) => {
    if (formData.artworks.length > 1) {
      setFormData(prev => ({
        ...prev,
        artworks: prev.artworks.filter((_, i) => i !== idx),
      }));
    }
  };

  /* ---------- validation (unchanged) ----------------------------------- */
  const validateFormAndGetErrors = (): ValidationError[] => {
    const list: ValidationError[] = [];

    // 1. Exhibition info
    if (!formData.exhibitionTitle.trim()) {
      list.push({
        field: 'exhibitionTitle',
        message: 'Exhibition title is required',
        elementRef: { current: exhibitionTitleRef.current },
        order: 100,
        section: 'Exhibition Information',
      });
    }

    // 2. Artworks
    formData.artworks.forEach((a, i) => {
      const base = 200 + i * 10;
      if (!a.imageUrl) list.push({
        field: `artwork-${a.id}-image`,
        message: `Artwork ${i+1}: You need to upload an image of the artwork`,
        elementRef: { current: artworkFieldRefs.current[`artwork-${a.id}-image`] },
        order: base + 1,
        section: `Artwork ${i+1}`,
      });
      if (!a.artistName.trim()) list.push({
        field: `artwork-${a.id}-artistName`,
        message: `Artwork ${i+1}: Artist name is required`,
        elementRef: { current: artworkFieldRefs.current[`artwork-${a.id}-artistName`] },
        order: base + 2,
        section: `Artwork ${i+1}`,
      });
      if (!a.technique.trim()) list.push({
        field: `artwork-${a.id}-technique`,
        message: `Artwork ${i+1}: Technique is required`,
        elementRef: { current: artworkFieldRefs.current[`artwork-${a.id}-technique`] },
        order: base + 3,
        section: `Artwork ${i+1}`,
      });
      if (!a.width || a.width <= 0) list.push({
        field: `artwork-${a.id}-width`,
        message: `Artwork ${i+1}: Width must be greater than 0`,
        elementRef: { current: artworkFieldRefs.current[`artwork-${a.id}-width`] },
        order: base + 4,
        section: `Artwork ${i+1}`,
      });
      if (!a.height || a.height <= 0) list.push({
        field: `artwork-${a.id}-height`,
        message: `Artwork ${i+1}: Height must be greater than 0`,
        elementRef: { current: artworkFieldRefs.current[`artwork-${a.id}-height`] },
        order: base + 5,
        section: `Artwork ${i+1}`,
      });
      if (!a.year || a.year < 1800 || a.year > new Date().getFullYear()) list.push({
        field: `artwork-${a.id}-year`,
        message: `Artwork ${i+1}: Valid year is required`,
        elementRef: { current: artworkFieldRefs.current[`artwork-${a.id}-year`] },
        order: base + 6,
        section: `Artwork ${i+1}`,
      });
    });

    // 3. User info
    if (!formData.userName.trim()) {
      list.push({
        field: 'userName',
        message: 'Your name is required',
        elementRef: { current: userNameRef.current },
        order: 900,
        section: 'Your Information',
      });
    }
    if (
      !formData.userEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)
    ) {
      list.push({
        field: 'userEmail',
        message: 'Your email address is required',
        elementRef: { current: userEmailRef.current },
        order: 910,
        section: 'Your Information',
      });
    }

    return list.sort((a, b) => a.order - b.order);
  };

  /* ---------- toast helpers -------------------------------------------- */
  const scrollToError = (idx: number) => {
    const e = validationErrors[idx];
    if (!e?.elementRef?.current) return;

    setHighlightedField(e.field);
    e.elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (
      e.elementRef.current instanceof HTMLInputElement ||
      e.elementRef.current instanceof HTMLTextAreaElement
    ) {
      setTimeout(() => e.elementRef.current!.focus(), 500);
    }
    setTimeout(() => setHighlightedField(null), 3000);
  };

  const handleNextError = () => {
    const curr = validateFormAndGetErrors();
    if (!curr.length) {
      setShowErrorToast(false);
      setShowSuccessToast(true);
      setValidationErrors([]);
      setCurrentErrorIndex(0);
      setHighlightedField(null);
      setTimeout(() => setShowSuccessToast(false), 5000);
      return;
    }
    setValidationErrors(curr);
    const next = currentErrorIndex < curr.length - 1 ? currentErrorIndex + 1 : 0;
    setCurrentErrorIndex(next);
    scrollToError(next);
  };

  /* ---------- submit ---------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validateFormAndGetErrors();
    if (errs.length) {
      setValidationErrors(errs);
      setCurrentErrorIndex(0);
      setShowErrorToast(true);
      scrollToError(0);
      return;
    }

    setIsSubmitting(true);

        /* ─── build the “draft” payload ─── */
        const roomWaitingDraft = {
          isModify:         false,
          exhibitionTitle:  formData.exhibitionTitle,
          galleryName:      formData.galleryName,
          name:             formData.userName,
          email:            formData.userEmail,
          galleryLogoStoragePath: formData.galleryLogoUrl
            ? storagePathFromDownloadUrl(formData.galleryLogoUrl)
            : '',
          createType:       'Form',
          isUserRegMode:    true,
          isGenerateAiInfo: true,
          aiInfoArtists:    [],         // to be filled in TrainWalter
          aiInfoExhibition: '',         // to be filled in TrainWalter
          artworks:         formData.artworks.map(a => {
            const { frameType, depth, frameWidth } = deriveFrame(a.unit, a.frameType);
            return {
              aiInfo:          '',       // to be filled in TrainWalter
              artist:          a.artistName,
              depth,
              frameColor:      colourMap[a.frameColor ?? 'transparent'] ?? 'grey',
              frameType,
              frameWidth,
              height:          a.height ? String(a.height) : '',
              imageStoragePath: a.imageUrl
                ? storagePathFromDownloadUrl(a.imageUrl)
                : '',
              sizeUnit:        a.unit,
              technique:       a.technique,
              title:           (a as any).title ?? '',
              width:           a.width ? String(a.width) : '',
              yearFrom:        String(a.year),
            };
          }),
        };
    
        /* ─── stash for TrainWalter ─── */
        sessionStorage.setItem('exhibitionData', JSON.stringify(formData));
        sessionStorage.setItem('roomWaitingDraft', JSON.stringify(roomWaitingDraft));

        // also stash the folderName
        const base = await getOrCreateFolderBase();
        const folderName = base.replace(/\/$/, '').split('/').pop()!;
        sessionStorage.setItem('folderName', folderName);
    
        setIsSubmitting(false);
        navigate('/train-walter');
       };

  /* ---------- helpers for highlight ------------------------------------ */
  const getFieldHighlightClass = (f: string) =>
    highlightedField === f
      ? 'ring-4 ring-red-400 ring-opacity-75 border-red-400 bg-red-50/10 animate-pulse shadow-lg shadow-red-400/50'
      : '';
  const getContainerHighlightClass = (f: string) =>
    highlightedField === f
      ? 'ring-4 ring-red-400 ring-opacity-75 border-red-400 bg-red-50/5 animate-pulse shadow-lg shadow-red-400/30 rounded-xl p-2 -m-2'
      : '';

  /* ---------- render ---------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120022] via-[#36124c] to-[#0f0c2e]">
      <Header hasUnsavedData={hasUnsavedData} onNavigateHome={handleNavigateHome} />

      <NavigationWarningModal
        isOpen={showNavigationWarning}
        onClose={cancelNavigation}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />

      <ErrorToast
        isVisible={showErrorToast}
        message={validationErrors[currentErrorIndex]?.message ?? ''}
        hasNext={validationErrors.length > 0}
        currentIndex={currentErrorIndex}
        totalErrors={validationErrors.length}
        onNext={handleNextError}
        onClose={() => setShowErrorToast(false)}
      />

      <ErrorToast
        isVisible={showSuccessToast}
        message="Congratulations! Now you can press the Train Walter button"
        isSuccess
        onClose={() => setShowSuccessToast(false)}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Create Your Exhibition</span>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload your artworks and provide details to create your AI-powered virtual gallery
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Exhibition Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Exhibition Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className={getContainerHighlightClass('exhibitionTitle')}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Exhibition Title *
                </label>
                <input
                  ref={exhibitionTitleRef}
                  type="text"
                  value={formData.exhibitionTitle}
                  onChange={e => handleInputChange('exhibitionTitle', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${getFieldHighlightClass('exhibitionTitle')}`}
                  placeholder="Enter exhibition title"
                />
                {errors.exhibitionTitle && (
                  <p className="text-red-400 text-sm mt-1">{errors.exhibitionTitle}</p>
                )}
              </div>
              
              <div className={getContainerHighlightClass('galleryName')}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gallery Name (Optional)
                </label>
                <input
                  ref={galleryNameRef}
                  type="text"
                  value={formData.galleryName}
                  onChange={e => handleInputChange('galleryName', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${getFieldHighlightClass('galleryName')}`}
                  placeholder="Enter gallery name"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gallery Logo (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleGalleryLogoUpload(file);
                  }}
                  className="hidden"
                  ref={el => fileInputRefs.current['gallery-logo'] = el}
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current['gallery-logo']?.click()}
                  disabled={uploadingImages['gallery-logo']}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-xl text-purple-300 hover:bg-purple-600/30 transition-colors disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>{uploadingImages['gallery-logo'] ? 'Uploading...' : 'Upload Logo'}</span>
                </button>
                {formData.galleryLogoUrl && (
                  <span className="text-green-400 text-sm">✓ Logo uploaded</span>
                )}
              </div>
            </div>
          </div>

          {/* Artworks */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Artworks</h2>
            </div>
            
            {formData.artworks.map((artwork, index) => (
              <div 
                key={artwork.id} 
                ref={el => artworkRefs.current[artwork.id] = el}
                className="mb-8 p-6 bg-white/5 rounded-2xl border border-gray-700 scroll-mt-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Artwork {index + 1}</h3>
                  {formData.artworks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArtwork(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Artwork Image *
                  </label>
                  <div 
                    ref={el => artworkFieldRefs.current[`artwork-${artwork.id}-image`] = el}
                    className={`flex items-center space-x-4 transition-all duration-300 ${getContainerHighlightClass(`artwork-${artwork.id}-image`)}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(index, file);
                      }}
                      className="hidden"
                      ref={el => fileInputRefs.current[`artwork-${index}`] = el}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[`artwork-${index}`]?.click()}
                      disabled={uploadingImages[artwork.id]}
                      className={`flex items-center space-x-2 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-xl text-purple-300 hover:bg-purple-600/30 transition-all duration-300 disabled:opacity-50 ${getFieldHighlightClass(`artwork-${artwork.id}-image`)}`}
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span>{uploadingImages[artwork.id] ? 'Uploading...' : 'Upload Image'}</span>
                    </button>
                    {artwork.imageUrl && (
                      <>
                        <img
                          src={artwork.imageUrl + '?w=80&h=80&c_fill'}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                        />
                        <span className="text-green-400 text-sm">✓ Image uploaded</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={getContainerHighlightClass(`artwork-${artwork.id}-artistName`)}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Artist Name *
                    </label>
                    <input
                      ref={el => artworkFieldRefs.current[`artwork-${artwork.id}-artistName`] = el}
                      type="text"
                      value={artwork.artistName}
                      onChange={e => handleArtworkChange(index, 'artistName', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${getFieldHighlightClass(`artwork-${artwork.id}-artistName`)}`}
                      placeholder="Enter artist name"
                    />
                  </div>
                  
                  <div className={getContainerHighlightClass(`artwork-${artwork.id}-technique`)}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Technique *
                    </label>
                    <input
                      ref={el => artworkFieldRefs.current[`artwork-${artwork.id}-technique`] = el}
                      type="text"
                      value={artwork.technique}
                      onChange={e => handleArtworkChange(index, 'technique', e.target.value)}
                      className={`w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${getFieldHighlightClass(`artwork-${artwork.id}-technique`)}`}
                      placeholder="e.g., Oil on canvas"
                    />
                  </div>
                </div>
                
                {/* Unit Toggle Switch */}
                <div className="mt-4 mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Measurement Unit
                  </label>
                  <div className="relative inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => handleArtworkChange(index, 'unit', artwork.unit === 'cm' ? 'inch' : 'cm')}
                      className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                        artwork.unit === 'cm' 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                          : 'bg-gradient-to-r from-blue-600 to-teal-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                          artwork.unit === 'cm' ? 'translate-x-1' : 'translate-x-11'
                        }`}
                      />
                    </button>
                    <div className="ml-4 flex items-center space-x-4">
                      <span className={`text-sm font-medium ${artwork.unit === 'cm' ? 'text-purple-300' : 'text-gray-400'}`}>
                        cm
                      </span>
                      <span className={`text-sm font-medium ${artwork.unit === 'inch' ? 'text-teal-300' : 'text-gray-400'}`}>
                        inch
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={getContainerHighlightClass(`artwork-${artwork.id}-width`)}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Width *
                    </label>
                    <input
                      ref={el => artworkFieldRefs.current[`artwork-${artwork.id}-width`] = el}
                      type="number"
                      step="0.1"
                      value={artwork.width || ''}
                      onChange={e => handleArtworkChange(index, 'width', parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${getFieldHighlightClass(`artwork-${artwork.id}-width`)}`}
                      placeholder="0"
                    />
                    <div className="text-xs text-gray-400 mt-1">{artwork.unit}</div>
                  </div>
                  
                  <div className={getContainerHighlightClass(`artwork-${artwork.id}-height`)}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Height *
                    </label>
                    <input
                      ref={el => artworkFieldRefs.current[`artwork-${artwork.id}-height`] = el}
                      type="number"
                      step="0.1"
                      value={artwork.height || ''}
                      onChange={e => handleArtworkChange(index, 'height', parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${getFieldHighlightClass(`artwork-${artwork.id}-height`)}`}
                      placeholder="0"
                    />
                    <div className="text-xs text-gray-400 mt-1">{artwork.unit}</div>
                  </div>
                  
                  <div className={getContainerHighlightClass(`artwork-${artwork.id}-year`)}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year *
                    </label>
                    <input
                      ref={el => artworkFieldRefs.current[`artwork-${artwork.id}-year`] = el}
                      type="number"
                      value={artwork.year || ''}
                      onChange={e => handleArtworkChange(index, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                      className={`w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${getFieldHighlightClass(`artwork-${artwork.id}-year`)}`}
                      placeholder="2024"
                    />
                  </div>
                </div>
                
                {/* Frame Type */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Frame Type (Optional)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {frameTypes.map(frame => (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => handleArtworkChange(index, 'frameType', frame.id)}
                        className={`p-3 rounded-xl border transition-all ${
                          artwork.frameType === frame.id
                            ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                            : 'border-gray-600 bg-white/5 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <div className="text-2xl mb-1">{frame.icon}</div>
                        <div className="text-sm">{frame.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Frame Color */}
                {(artwork.frameType === 'framed' || artwork.frameType === 'framed-thin') && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Frame Color (Optional)
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {frameColors.map(color => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => handleArtworkChange(index, 'frameColor', color.id)}
                          className={`p-3 rounded-xl border transition-all ${
                            artwork.frameColor === color.id
                              ? 'border-purple-500 bg-purple-500/20'
                              : 'border-gray-600 bg-white/5 hover:border-gray-500'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full mx-auto mb-1 ${
                              color.border ? 'border-2 border-gray-400' : ''
                            }`}
                            style={{ backgroundColor: color.color }}
                          />
                          <div className="text-xs text-gray-300">{color.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Artwork Button */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={addArtwork}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Add Another Artwork</span>
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Your Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className={getContainerHighlightClass('userName')}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  ref={userNameRef}
                  type="text"
                  value={formData.userName}
                  onChange={e => handleInputChange('userName', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${getFieldHighlightClass('userName')}`}
                  placeholder="Enter your name"
                />
                {errors.userName && (
                  <p className="text-red-400 text-sm mt-1">{errors.userName}</p>
                )}
              </div>
              
              <div className={getContainerHighlightClass('userEmail')}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Email Address *
                </label>
                <input
                  ref={userEmailRef}
                  type="email"
                  value={formData.userEmail}
                  onChange={e => handleInputChange('userEmail', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${getFieldHighlightClass('userEmail')}`}
                  placeholder="Enter your email"
                />
                {errors.userEmail && (
                  <p className="text-red-400 text-sm mt-1">{errors.userEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#f047ff] to-pink-500 text-white px-12 py-4 rounded-full font-semibold text-lg hover:from-purple-500 hover:to-pink-400 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              <span>{isSubmitting ? 'Processing...' : 'Train Walter'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExhibition;