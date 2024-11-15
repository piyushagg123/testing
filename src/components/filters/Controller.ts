const handleCheckboxChange = (
  item: string,
  selectedItems: Set<any>,
  setSelectedItems: React.Dispatch<React.SetStateAction<Set<any>>>,
  setFilters: React.Dispatch<React.SetStateAction<Set<any>>>,
  filters: Set<any>
) => {
  const updatedItems = new Set(selectedItems);
  if (updatedItems.has(item)) {
    updatedItems.delete(item);
  } else {
    updatedItems.add(item);
  }
  setSelectedItems(updatedItems);
  handleFilterChange(item, filters, setFilters);
};

const handleFilterChange = (
  updatedItem: string,
  filters: Set<any>,
  setFilters: React.Dispatch<React.SetStateAction<Set<any>>>
) => {
  if (updatedItem === "") setFilters(new Set());
  else {
    updatedItem = updatedItem.replace(/\s+/g, "_");
    const updatedFilters = new Set(filters);
    if (updatedFilters.has(updatedItem)) {
      updatedFilters.delete(updatedItem);
    } else {
      updatedFilters.add(updatedItem);
    }
    setFilters(updatedFilters);
  }
};

export { handleCheckboxChange, handleFilterChange };
