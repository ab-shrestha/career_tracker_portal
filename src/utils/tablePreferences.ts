export interface TableSortPreferences {
  sortField: string;
  sortDirection: "asc" | "desc";
}

export const getTablePreferences = (tableId: string): TableSortPreferences | null => {
  const preferences = localStorage.getItem(`table_preferences_${tableId}`);
  return preferences ? JSON.parse(preferences) : null;
};

export const saveTablePreferences = (tableId: string, preferences: TableSortPreferences) => {
  localStorage.setItem(`table_preferences_${tableId}`, JSON.stringify(preferences));
}; 