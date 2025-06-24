// src/types/shared.ts
export interface ExhibitionWizardPayload {
    exhibition: ExhibitionData;   // from CreateExhibition
    training:   TrainingData;     // from TrainWalter (initially empty)
  }
  