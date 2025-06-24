// src/utils/validation.ts
import { z } from 'zod';

export const artworkSchema = z.object({
  artistName: z.string().min(1, 'Artist name is required'),
  imageUrl: z.string().nullable(),
  width: z.number().min(0.1, 'Width must be greater than 0'),
  height: z.number().min(0.1, 'Height must be greater than 0'),
  technique: z.string().min(1, 'Technique is required'),
  year: z.number().min(1800, 'Year must be after 1800').max(new Date().getFullYear(), 'Year cannot be in the future'),
  frameType: z.enum(['framed', 'framed-thin', 'stretched']),
  frameColor: z.string().optional(),
});

export const exhibitionSchema = z.object({
  exhibitionTitle: z.string().min(1, 'Exhibition title is required'),
  galleryName: z.string().optional(),
  galleryLogoUrl: z.string().nullable(),
  userName: z.string().min(1, 'Your name is required'),
  userEmail: z.string().email('Please enter a valid email address'),
  artworks: z.array(artworkSchema).min(1, 'At least one artwork is required'),
});

export const trainingSchema = z.object({
  exhibitionInfo: z.string().min(300, 'Exhibition information must be at least 300 characters'),
  galleryInfo: z.string().optional(),
  artistsInfo: z.record(z.string().min(300, 'Artist information must be at least 300 characters')),
  artworksInfo: z.record(z.string().min(300, 'Artwork information must be at least 300 characters')),
});