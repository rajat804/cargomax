// app/warehouses/components/WarehouseList.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, MapPin, Building2 } from "lucide-react";

const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI || "http://localhost:4000";

export default function WarehouseList() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch warehouses from backend
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await axios.get(`${BASE_URI}/api/warehouses`);
        setWarehouses(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  // Filter Logic
  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch =
      warehouse.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || warehouse.status === statusFilter;
    const matchesType = typeFilter === "all" || warehouse.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return <div className="text-center py-12 text-lg">Loading warehouses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search Card - Your Preferred Design */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Management</CardTitle>
          <CardDescription>
            Search, filter, and manage your warehouse locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search warehouses by name, code or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="distribution">Distribution</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="fulfillment">Fulfillment</SelectItem>
                  <SelectItem value="cross-dock">Cross-Dock</SelectItem>
                  <SelectItem value="cold-storage">Cold Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warehouse Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWarehouses.map((warehouse) => (
          <Card key={warehouse._id} className="hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {warehouse.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {warehouse.code}
                  </Badge>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {warehouse.type?.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p>{warehouse.address}</p>
                  <p className="text-muted-foreground">
                    {warehouse.city}, {warehouse.state} {warehouse.zip}
                  </p>
                </div>
              </div>

              {/* Capacity & Type Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Capacity</p>
                  <p className="font-medium">
                    {(warehouse.capacity / 1000).toFixed(0)}K sq ft
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge 
                    variant="outline" 
                    className="capitalize text-xs"
                  >
                    {warehouse.status || "Operational"}
                  </Badge>
                </div>
              </div>

              {/* Manager */}
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">Manager</p>
                <p className="font-medium">{warehouse.manager}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWarehouses.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No warehouses found matching your search and filters.
        </div>
      )}
    </div>
  );
}