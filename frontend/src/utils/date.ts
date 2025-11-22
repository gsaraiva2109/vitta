// /frontend/src/utils/date.ts

/**
 * Converte uma data no formato "dd/mm/aaaa" para o formato ISO "aaaa-mm-dd".
 * @param brDate A data no formato brasileiro.
 * @returns A data no formato ISO, ou uma string vazia se a entrada for inválida.
 */
export const brToISO = (brDate: string): string => {
  if (!brDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(brDate)) {
    return '';
  }
  const [day, month, year] = brDate.split('/');
  return `${year}-${month}-${day}`;
};

/**
 * Converte uma data no formato ISO "aaaa-mm-dd" para o formato "dd/mm/aaaa".
 * @param isoDate A data no formato ISO.
 * @returns A data no formato brasileiro, ou uma string vazia se a entrada for inválida.
 */
export const isoToBr = (isoDate: string): string => {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}/.test(isoDate)) {
    return '';
  }
  const [year, month, day] = isoDate.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};
