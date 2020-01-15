export function defaultStateAccumulation<T>(acc: T, command: Partial<T>): T {
  return { ...acc, ...command };
}

export function deleteUndefinedStateAccumulator<T>(
  acc: T,
  [keyToDelete, value]: [string, any]
): T {
  /*
    const isKeyToDeletePresent = keyToDelete in acc;
    // The key you want to delete is not stored :)
    if (!isKeyToDeletePresent && value === undefined) {
        return acc;
    }
    // Delete slice
    if (value === undefined) {
        const {[keyToDelete]: v, ...newS} = acc as any;
        return newS;
    }
     */
  return acc;
}
