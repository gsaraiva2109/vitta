import { AxiosError } from 'axios';

interface ApiErrorDetail {
  message: string;
  field: string;
}

interface ApiErrorResponse {
  message: string;
  details?: ApiErrorDetail[];
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response) {
    const responseData = error.response.data as ApiErrorResponse;

    if (responseData.message) {
      if (responseData.details && responseData.details.length > 0) {
        const details = responseData.details.map(d => `${d.field}: ${d.message}`).join('; ');
        return `${responseData.message}: ${details}`;
      }
      return responseData.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
};
