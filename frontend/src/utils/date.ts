// /frontend/src/utils/date.ts
import { parse, format, isValid } from 'date-fns';

/**
 * Converte uma data no formato "dd/mm/aaaa" para o formato ISO "aaaa-mm-dd".
 * Retorna null se a data de entrada for nula, indefinida, vazia ou inválida.
 * @param brDate A data no formato brasileiro.
 * @returns A data no formato ISO, ou null se a entrada for inválida.
 */
export const brToISO = (brDate: string | null | undefined): string | null => {
  if (!brDate) return null;
  
  const parsedDate = parse(brDate, 'dd/MM/yyyy', new Date());
  
  if (!isValid(parsedDate)) {
    return null;
  }
  
  return format(parsedDate, 'yyyy-MM-dd');
};

/**
 * Converte uma data no formato ISO "aaaa-mm-dd" para o formato "dd/mm/aaaa".
 * @param isoDate A data no formato ISO.
 * @returns A data no formato brasileiro, ou uma string vazia se a entrada for inválida.
 */
export const isoToBr = (isoDate: string): string => {
  if (!isoDate) return '';
  
  const parsedDate = parse(isoDate, 'yyyy-MM-dd', new Date());

  if (!isValid(parsedDate)) {
      // Tenta analisar com a hora se o formato inicial falhar
      const parsedDateTime = parse(isoDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date());
      if(isValid(parsedDateTime)) {
          return format(parsedDateTime, 'dd/MM/yyyy');
      }
      return '';
  }

  return format(parsedDate, 'dd/MM/yyyy');
};

export function formatDateLocale(isoDate: string | null | undefined): string {
  if (!isoDate) {
    return 'N/A';
  }
  try {
    // We assume the date is already in UTC from the backend (DATE type in postgres stores without timezone)
    // and we want to show it in the user's local day.
    const date = new Date(isoDate);
    // Adjust for timezone offset to prevent day-before issues
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return new Intl.DateTimeFormat(navigator.language).format(adjustedDate);
  } catch (e) {
    console.error('Invalid date for formatting:', isoDate, e);
    return 'Data inválida';
  }
}
