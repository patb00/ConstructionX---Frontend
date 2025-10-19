export interface ToolCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface NewToolCategoryRequest {
  name: string;
  description?: string | null;
}

export interface UpdateToolCategoryRequest {
  id: number;
  name: string;
  description?: string | null;
}
