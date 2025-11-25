import { authenticatedFetch } from './apiService';
import type { Alert } from '../models/Alert';

export async function getAlerts(): Promise<Alert[]> {
  return authenticatedFetch<Alert[]>('/alerts', {
    method: 'GET',
  });
}
