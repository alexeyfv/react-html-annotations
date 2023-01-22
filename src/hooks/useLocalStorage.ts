export default function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [() => T, (value: T) => void] {
  const save = (value: T) => localStorage.setItem(key, JSON.stringify(value));
  const restore = (): T => {
    const raw = localStorage.getItem(key);
    return raw == null ? defaultValue : JSON.parse(raw);
  };

  return [restore, save];
}
