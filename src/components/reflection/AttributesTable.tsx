import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pen, Trash, Eye, Save, ArrowUpDown, Search, FilterX } from "lucide-react";
import { TableItem } from "@/types/ReflectionTypes";

type AttributesTableProps = {
  items: TableItem[];
  setItems: React.Dispatch<React.SetStateAction<TableItem[]>>;
  newValue: string;
  setNewValue: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  handleAddItem: (
    items: TableItem[],
    setItems: React.Dispatch<React.SetStateAction<TableItem[]>>,
    newValue: string,
    setNewValue: React.Dispatch<React.SetStateAction<string>>,
    type: string
  ) => void;
  handleEditItem: (
    items: TableItem[],
    setItems: React.Dispatch<React.SetStateAction<TableItem[]>>,
    id: string
  ) => void;
  handleUpdateItem: (
    items: TableItem[],
    setItems: React.Dispatch<React.SetStateAction<TableItem[]>>,
    id: string,
    newValue: string,
    type: string
  ) => void;
  handleDeleteItem: (
    items: TableItem[],
    setItems: React.Dispatch<React.SetStateAction<TableItem[]>>,
    id: string,
    type: string
  ) => void;
};

const AttributesTable: React.FC<AttributesTableProps> = ({
  items,
  setItems,
  newValue,
  setNewValue,
  type,
  handleAddItem,
  handleEditItem,
  handleUpdateItem,
  handleDeleteItem,
}) => {
  const [search, setSearch] = React.useState("");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const getSortIcon = () => {
    return sortDirection === "asc" ? <ArrowUpDown className="h-4 w-4 rotate-180" /> : <ArrowUpDown className="h-4 w-4" />;
  };

  const filteredAndSortedItems = items
    .filter(item => item.value.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const comparison = a.value.localeCompare(b.value);
      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium">{type}</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-[200px]"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          {search && (
            <Button variant="outline" size="sm" onClick={() => setSearch("")}>
              <FilterX className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80%]">
                <Button variant="ghost" className="p-0 h-auto font-medium" onClick={handleSort}>
                  Value {getSortIcon()}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                  No items found. Add your first item to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.isEditing ? (
                      <Input 
                        defaultValue={item.value} 
                        id={`edit-${item.id}`}
                        className="w-full"
                      />
                    ) : (
                      item.value
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.isEditing ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const inputEl = document.getElementById(`edit-${item.id}`) as HTMLInputElement;
                            handleUpdateItem(items, setItems, item.id, inputEl.value, type);
                          }}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(items, setItems, item.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(items, setItems, item.id)}
                        >
                          <Pen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(items, setItems, item.id, type)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-2">
        <Input 
          placeholder={`Add ${type.toLowerCase()}`}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <Button 
          size="sm"
          onClick={() => handleAddItem(items, setItems, newValue, setNewValue, type)}
        >
          Add {type}
        </Button>
      </div>
    </div>
  );
};

export default AttributesTable;
