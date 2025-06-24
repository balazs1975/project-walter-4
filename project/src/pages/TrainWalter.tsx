// src/pages/TrainWalter.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Bot, ArrowRight, MessageSquare } from 'lucide-react';
import { z } from 'zod';
import { ExhibitionData, TrainingData } from '../types/exhibition';
import { trainingSchema } from '../utils/validation';
import Header from '../components/Header';
import NavigationWarningModal from '../components/NavigationWarningModal';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
];

const TrainWalter = () => {
  const navigate = useNavigate();
  const [exhibitionData, setExhibitionData] = useState<ExhibitionData | null>(null);
  const [trainingData, setTrainingData] = useState<TrainingData>({
    exhibitionInfo: '',
    artistsInfo: {},
    galleryInfo: '',
    artworksInfo: {},
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState<{ [key: string]: boolean }>({});
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [hasUnsavedData, setHasUnsavedData] = useState(false);

  /* ─── refs that hold the draft built in CreateExhibition ─── */
  const roomWaitingDraftRef = useRef<any>(null);
  const folderNameRef       = useRef<string | null>(null);

  /* ─── Cloud Function callable ─── */
  const setRoomWaiting = httpsCallable(functions, 'SetRoomWaitingV2Call');

  /* ─────────────────────────────────────────────────────────── */
  /*  INIT – load session-storage, build local state            */
  /* ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    /* 1. exhibition data from first step */
    const storedData = sessionStorage.getItem('exhibitionData');
    if (!storedData) {
      navigate('/create-exhibition');
      return;
    }
    const data: ExhibitionData = JSON.parse(storedData);
    setExhibitionData(data);

    /* 2. scaffold trainingData maps */
    const uniqueArtists = [...new Set(data.artworks.map(a => a.artistName))];
    const artistsInfo:  { [k: string]: string } = {};
    const artworksInfo: { [k: string]: string } = {};

    uniqueArtists.forEach(a => { artistsInfo[a] = ''; });
    data.artworks.forEach(a => { artworksInfo[a.id] = ''; });

    setTrainingData(prev => ({ ...prev, artistsInfo, artworksInfo }));

    /* 3. speech-to-text */
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recog: SpeechRecognition = new SR();
      recog.continuous = false;
      recog.interimResults = false;
      setRecognition(recog);
    }

    /* 4. pick up draft + folder name */
    const rawDraft = sessionStorage.getItem('roomWaitingDraft');
    if (rawDraft) roomWaitingDraftRef.current = JSON.parse(rawDraft);
    folderNameRef.current = sessionStorage.getItem('folderName');
  }, [navigate]);

  /* mark page “dirty” when user typed something */
  useEffect(() => {
    const dirty =
      trainingData.exhibitionInfo.trim() !== '' ||
      trainingData.galleryInfo.trim()     !== '' ||
      Object.values(trainingData.artistsInfo).some(v => v.trim() !== '') ||
      Object.values(trainingData.artworksInfo).some(v => v.trim() !== '');
    setHasUnsavedData(dirty);
  }, [trainingData]);

  /* ─────────────────────────────────────────────────────────── */
  /*  helpers                                                   */
  /* ─────────────────────────────────────────────────────────── */
  const handleNavigateHome = () => setShowNavigationWarning(true);
  const confirmNavigation  = () => { setShowNavigationWarning(false); navigate('/'); };
  const cancelNavigation   = () => setShowNavigationWarning(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('artist-')) {
      const artist = field.replace('artist-', '');
      setTrainingData(p => ({ ...p, artistsInfo: { ...p.artistsInfo, [artist]: value } }));
    } else if (field.startsWith('artwork-')) {
      const id = field.replace('artwork-', '');
      setTrainingData(p => ({ ...p, artworksInfo: { ...p.artworksInfo, [id]: value } }));
    } else {
      setTrainingData(p => ({ ...p, [field]: value }));
    }
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const startRecording = (field: string) => {
    if (!recognition) return;
    setIsRecording(p => ({ ...p, [field]: true }));
    recognition.lang = selectedLanguage;

    recognition.onresult = ev => {
      const transcript   = ev.results[0][0].transcript;
      const currentValue = getFieldValue(field);
      const newValue     = currentValue ? `${currentValue} ${transcript}` : transcript;
      handleInputChange(field, newValue);
    };
    recognition.onend = () => setIsRecording(p => ({ ...p, [field]: false }));
    recognition.start();
  };

  const stopRecording = (field: string) => {
    recognition?.stop();
    setIsRecording(p => ({ ...p, [field]: false }));
  };

  const getFieldValue = (field: string) => {
    if (field.startsWith('artist-'))  return trainingData.artistsInfo[field.replace('artist-', '')]  || '';
    if (field.startsWith('artwork-')) return trainingData.artworksInfo[field.replace('artwork-', '')] || '';
    return (trainingData as any)[field] || '';
  };

  const getCharacterCount = (field: string) => getFieldValue(field).length;

  const validateForm = () => {
    try {
      trainingSchema.parse(trainingData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errs: { [k: string]: string } = {};
        err.errors.forEach(e => { errs[e.path.join('-')] = e.message; });
        setErrors(errs);
      }
      return false;
    }
  };

  /* ─────────────────────────────────────────────────────────── */
  /*  SUBMIT                                                    */
  /* ─────────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!exhibitionData || !roomWaitingDraftRef.current) {
      alert('Session expired – please start over.');
      navigate('/create-exhibition');
      return;
    }

    setIsSubmitting(true);

/* ---------- build final payload ---------- */
const roomWaiting = structuredClone(roomWaitingDraftRef.current);

/* exhibition-level text */
roomWaiting.aiInfoExhibition = trainingData.exhibitionInfo;
roomWaiting.galleryInfo      = trainingData.galleryInfo;

/* per-artist */
roomWaiting.aiInfoArtists = Object.entries(trainingData.artistsInfo)
  .map(([artist, aiInfo]) => ({ artist, aiInfo }));

/* per-artwork */
const keyFor = (art: any) => art.id ?? art.imageStoragePath.split('/').pop()!.replace(/\.[^.]+$/, '');
roomWaiting.artworks = roomWaiting.artworks.map((art: any) => ({
  ...art,
  aiInfo: trainingData.artworksInfo[keyFor(art)] ?? '',
}));

/* ---------- call Cloud Function ---------- */
try {
  await setRoomWaiting({
    formId:          folderNameRef.current,   // <- same value CreateExhibition used
    generatorType:   'Standard',
    roomGeneratorId: 'TSKF2JTI0YL4DJFY',      // <- hard-coded in the CF spec
    roomWaiting,
  });
  console.log('RoomWaiting created');
} catch (err) {
  console.error('[SetRoomWaiting] failed:', err);
  alert('Server error while saving your exhibition – please try again later.');
  setIsSubmitting(false);
  return;
}

    /* clean up + success */
    sessionStorage.removeItem('roomWaitingDraft');
    sessionStorage.removeItem('folderName');
    sessionStorage.removeItem('exhibitionData');

    alert('🎉 Exhibition created successfully! Walter is now trained and ready to showcase your art.');
    navigate('/');
  };

  /* ─────────────────────────────────────────────────────────── */
  /*  RENDER                                                    */
  /* ─────────────────────────────────────────────────────────── */
  if (!exhibitionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#120022] via-[#36124c] to-[#0f0c2e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading exhibition data...</p>
        </div>
      </div>
    );
  }

  const uniqueArtists = [...new Set(exhibitionData.artworks.map(a => a.artistName))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120022] via-[#36124c] to-[#0f0c2e]">
      <Header hasUnsavedData={hasUnsavedData} onNavigateHome={handleNavigateHome} />

      <NavigationWarningModal
        isOpen={showNavigationWarning}
        onClose={cancelNavigation}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Train Walter</span>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Help Walter understand your art by providing detailed information about your exhibition, artworks, and artistic vision
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  FORM                                                           */}
        {/* ---------------------------------------------------------------- */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Exhibition Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <MessageSquare className="h-6 w-6" />
              <span>Exhibition Information</span>
            </h2>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Tell Walter about your exhibition concept, theme, and overall vision *
                </label>
                <div className="flex items-center space-x-2">
                  {recognition && (
                    <>
                      <select
                        value={selectedLanguage}
                        onChange={e => setSelectedLanguage(e.target.value)}
                        className="px-3 py-1 bg-white/10 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                      </select>
                      <button
                        type="button"
                        onClick={() => isRecording.exhibitionInfo ? stopRecording('exhibitionInfo') : startRecording('exhibitionInfo')}
                        className={`p-2 rounded-lg transition-colors ${
                          isRecording.exhibitionInfo
                            ? 'bg-red-500 text-white'
                            : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
                        }`}
                      >
                        {isRecording.exhibitionInfo ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <textarea
                value={trainingData.exhibitionInfo}
                onChange={e => handleInputChange('exhibitionInfo', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Describe your exhibition's concept, inspiration, artistic themes, and what visitors should understand about your work..."
              />

              <div className="flex items-center justify-between mt-2">
                <div className={`text-sm ${getCharacterCount('exhibitionInfo') < 300 ? 'text-red-400' : 'text-green-400'}`}>
                  {getCharacterCount('exhibitionInfo')} / 300 characters minimum
                </div>
                {getCharacterCount('exhibitionInfo') < 300 && (
                  <div className="text-red-400 text-sm">⚠ Minimum 300 characters required</div>
                )}
              </div>

              {errors.exhibitionInfo && (
                <p className="text-red-400 text-sm mt-1">{errors.exhibitionInfo}</p>
              )}
            </div>
          </div>

          {/* Artists Information */}
          {uniqueArtists.map(artist => (
            <div key={artist} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">
                Artist Information: {artist}
              </h2>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Tell Walter about {artist}'s background, style, and artistic journey *
                  </label>
                  <div className="flex items-center space-x-2">
                    {recognition && (
                      <>
                        <select
                          value={selectedLanguage}
                          onChange={e => setSelectedLanguage(e.target.value)}
                          className="px-3 py-1 bg-white/10 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                        </select>
                        <button
                          type="button"
                          onClick={() => isRecording[`artist-${artist}`] ? stopRecording(`artist-${artist}`) : startRecording(`artist-${artist}`)}
                          className={`p-2 rounded-lg transition-colors ${
                            isRecording[`artist-${artist}`]
                              ? 'bg-red-500 text-white'
                              : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
                          }`}
                        >
                          {isRecording[`artist-${artist}`] ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <textarea
                  value={trainingData.artistsInfo[artist] || ''}
                  onChange={e => handleInputChange(`artist-${artist}`, e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder={`Describe ${artist}'s artistic background, influences, techniques, career highlights, and what makes their work unique...`}
                />

                <div className="flex items-center justify-between mt-2">
                  <div className={`text-sm ${getCharacterCount(`artist-${artist}`) < 300 ? 'text-red-400' : 'text-green-400'}`}>
                    {getCharacterCount(`artist-${artist}`)} / 300 characters minimum
                  </div>
                  {getCharacterCount(`artist-${artist}`) < 300 && (
                    <div className="text-red-400 text-sm">⚠ Minimum 300 characters required</div>
                  )}
                </div>

                {errors[`artistsInfo-${artist}`] && (
                  <p className="text-red-400 text-sm mt-1">{errors[`artistsInfo-${artist}`]}</p>
                )}
              </div>
            </div>
          ))}

          {/* Gallery Information */}
          {exhibitionData.galleryName && (
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">
                Gallery Information: {exhibitionData.galleryName}
              </h2>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Tell Walter about your gallery's mission, history, and curatorial approach (Optional)
                  </label>
                  <div className="flex items-center space-x-2">
                    {recognition && (
                      <>
                        <select
                          value={selectedLanguage}
                          onChange={e => setSelectedLanguage(e.target.value)}
                          className="px-3 py-1 bg-white/10 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                        </select>
                        <button
                          type="button"
                          onClick={() => isRecording.galleryInfo ? stopRecording('galleryInfo') : startRecording('galleryInfo')}
                          className={`p-2 rounded-lg transition-colors ${
                            isRecording.galleryInfo
                              ? 'bg-red-500 text-white'
                              : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
                          }`}
                        >
                          {isRecording.galleryInfo ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <textarea
                  value={trainingData.galleryInfo}
                  onChange={e => handleInputChange('galleryInfo', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe your gallery's philosophy, curatorial vision, and what makes it unique..."
                />

                <div className="text-sm text-gray-400 mt-2">
                  {getCharacterCount('galleryInfo')} characters
                </div>
              </div>
            </div>
          )}

          {/* Artworks Information */}
          {exhibitionData.artworks.map((art, idx) => (
            <div key={art.id} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20">
              <div className="flex items-start space-x-4 mb-6">
                {art.imageUrl && (
                  <img
                    src={`${art.imageUrl}?w=80&h=80&c_fill`}
                    alt="Artwork preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">Artwork {idx + 1}</h2>
                  <p className="text-gray-300">
                    {art.artistName} • {art.technique} • {art.year}
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Tell Walter about this specific artwork's story, meaning, and context *
                  </label>
                  <div className="flex items-center space-x-2">
                    {recognition && (
                      <>
                        <select
                          value={selectedLanguage}
                          onChange={e => setSelectedLanguage(e.target.value)}
                          className="px-3 py-1 bg-white/10 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                        </select>
                        <button
                          type="button"
                          onClick={() => isRecording[`artwork-${art.id}`] ? stopRecording(`artwork-${art.id}`) : startRecording(`artwork-${art.id}`)}
                          className={`p-2 rounded-lg transition-colors ${
                            isRecording[`artwork-${art.id}`]
                              ? 'bg-red-500 text-white'
                              : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
                          }`}
                        >
                          {isRecording[`artwork-${art.id}`] ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <textarea
                  value={trainingData.artworksInfo[art.id] || ''}
                  onChange={e => handleInputChange(`artwork-${art.id}`, e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe this artwork's inspiration, creation process, symbolism, emotional impact, and what viewers should notice..."
                />

                <div className="flex items-center justify-between mt-2">
                  <div className={`text-sm ${getCharacterCount(`artwork-${art.id}`) < 300 ? 'text-red-400' : 'text-green-400'}`}>
                    {getCharacterCount(`artwork-${art.id}`)} / 300 characters minimum
                  </div>
                  {getCharacterCount(`artwork-${art.id}`) < 300 && (
                    <div className="text-red-400 text-sm">⚠ Minimum 300 characters required</div>
                  )}
                </div>

                {errors[`artworksInfo-${art.id}`] && (
                  <p className="text-red-400 text-sm mt-1">{errors[`artworksInfo-${art.id}`]}</p>
                )}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#f047ff] to-pink-500 text-white px-12 py-4 rounded-full font-semibold text-lg hover:from-purple-500 hover:to-pink-400 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              <span>{isSubmitting ? 'Creating Exhibition...' : 'Create My Exhibition with Walter'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <p className="text-gray-400 text-sm mt-4">
              Walter will use this information to engage with visitors and showcase your art professionally
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainWalter;
