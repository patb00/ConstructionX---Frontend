export interface JobPosition {
  id: number;
  name: string;
  description: string | null;
}

export interface NewJobPositionRequest {
  name: string;
  description?: string | null;
}

export interface UpdateJobPositionRequest {
  id: number;
  name: string;
  description?: string | null;
}
