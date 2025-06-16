
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface MobileTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface MobileTableProps {
  data: any[];
  columns: MobileTableColumn[];
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, string>) => void;
  onRowSelect?: (row: any) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  searchable?: boolean;
  filterable?: boolean;
}

export const MobileTable: React.FC<MobileTableProps> = ({
  data,
  columns,
  onSort,
  onFilter,
  onRowSelect,
  pagination,
  searchable = false,
  filterable = false
}) => {
  const { deviceType } = useDeviceDetection();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortColumn, setSortColumn] = React.useState<string>('');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort?.(column, newDirection);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Implement search logic here
  };

  if (deviceType === 'mobile') {
    return (
      <div className="space-y-4">
        {/* Mobile Controls */}
        {(searchable || filterable) && (
          <div className="flex flex-col space-y-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            {filterable && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Card Layout */}
        <div className="space-y-3">
          {data.map((row, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onRowSelect?.(row)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  {columns.map((column) => (
                    <div key={column.key} className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground font-medium min-w-0 flex-shrink-0 mr-3">
                        {column.label}:
                      </span>
                      <span className="text-sm text-right flex-1 min-w-0">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Pagination */}
        {pagination && (
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <Button 
              variant="outline" 
              size="sm"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Desktop table layout
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th 
                key={column.key}
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50"
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && <ArrowUpDown className="h-4 w-4" />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={index}
              className="border-b hover:bg-muted/50 cursor-pointer"
              onClick={() => onRowSelect?.(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="p-3">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ResponsiveTable: React.FC<MobileTableProps> = (props) => {
  return <MobileTable {...props} />;
};
