// src/types/exhibition.ts
export interface Artwork {
  id: string;
  imageUrl: string | null;    // new - stores Cloudinary URL
  imagePreview?: string;      // exists - for UI preview
  artistName: string;
  width: number;
  height: number;
  unit: 'cm' | 'inch';
  technique: string;
  year: number;
  frameType: 'framed' | 'framed-thin' | 'stretched';
  frameColor?: string;
}

export interface ExhibitionData {
  exhibitionTitle: string;
  galleryName: string;
  galleryLogoUrl: string | null;  // new - stores Cloudinary URL
  artworks: Artwork[];
  userName: string;
  userEmail: string;
}

export interface TrainingData {
  exhibitionInfo: string;
  artistsInfo: { [artistName: string]: string };
  galleryInfo: string;
  artworksInfo: { [artworkId: string]: string };
}