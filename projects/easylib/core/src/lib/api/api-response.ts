export interface ApiResponse {
  status?: string;
  result?: string;
  message?: string;
  data?: string | Record<string, any> | Record<string, any>[];
}
// export type ApiResponse = Record<string, any>;
