export function saveFormState(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFormState(key: string) {
  return JSON.parse(localStorage.getItem(key) || '{}');
}

export function clearFormState(key: string) {
  localStorage.removeItem(key);
}
