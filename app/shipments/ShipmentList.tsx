"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye, Edit, Copy, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI || "http://localhost:4000";

export default function ShipmentList() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("trackingId");
    const [sortDirection, setSortDirection] = useState("desc");
    const [selectedShipments, setSelectedShipments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch Shipments from Backend
    const fetchShipments = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URI}/api/shipments`);
            setShipments(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch shipments:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load shipments from server",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipments();
    }, []);

    // Sorting
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    // Filter & Sort Data
    const filteredShipments = [...shipments]
        .filter((shipment) =>
            shipment.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.trackingId?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            if (sortField === "trackingId") {
                valA = a.trackingId || "";
                valB = b.trackingId || "";
            }

            if (typeof valA === "string") {
                return sortDirection === "asc"
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }
            return sortDirection === "asc" ? valA - valB : valB - valA;
        });

    // Pagination
    const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
    const paginatedShipments = filteredShipments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSelectAll = () => {
        if (selectedShipments.length === paginatedShipments.length) {
            setSelectedShipments([]);
        } else {
            setSelectedShipments(paginatedShipments.map((s) => s._id));
        }
    };

    const toggleSelectShipment = (id) => {
        if (selectedShipments.includes(id)) {
            setSelectedShipments(selectedShipments.filter((sid) => sid !== id));
        } else {
            setSelectedShipments([...selectedShipments, id]);
        }
    };

    const handleViewShipment = (shipment) => {
        console.log("View shipment:", shipment);
        // TODO: Open details dialog
    };

    const handleEditShipment = (shipment) => {
        console.log("Edit shipment:", shipment);
    };

    const handleDuplicateShipment = (shipment) => {
        console.log("Duplicate shipment:", shipment);
    };

    const handleDeleteShipment = (shipment) => {
        if (confirm(`Delete shipment ${shipment.trackingId}?`)) {
            console.log("Delete shipment:", shipment);
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            "in-transit": "bg-blue-100 text-blue-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return (
            <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
                {status?.toUpperCase()}
            </Badge>
        );
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            express: "bg-red-100 text-red-700",
            standard: "bg-blue-100 text-blue-700",
            economy: "bg-gray-100 text-gray-700",
        };
        return (
            <Badge className={colors[priority] || ""}>
                {priority?.toUpperCase()}
            </Badge>
        );
    };

    if (loading) {
        return <div className="text-center py-12">Loading shipments...</div>;
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle>Shipment List</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="rounded-md border overflow-auto">
                    <Table className="whitespace-nowrap min-w-[1000px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Checkbox
                                        checked={
                                            selectedShipments.length === paginatedShipments.length &&
                                            paginatedShipments.length > 0
                                        }
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("trackingId")}
                                >
                                    Tracking ID
                                    {sortField === "trackingId" && (
                                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                                    )}
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer"
                                    onClick={() => handleSort("customer")}
                                >
                                    Customer
                                    {sortField === "customer" && (
                                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                                    )}
                                </TableHead>
                                <TableHead className="hidden md:table-cell">W   arehouse</TableHead>
                                <TableHead className="hidden md:table-cell">Vender</TableHead>
                                <TableHead className="hidden lg:table-cell">Type</TableHead>
                                <TableHead className="hidden lg:table-cell">Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedShipments.length > 0 ? (
                                paginatedShipments.map((shipment) => (
                                    <TableRow key={shipment._id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedShipments.includes(shipment._id)}
                                                onCheckedChange={() => toggleSelectShipment(shipment._id)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono font-medium">
                                            <div className="flex flex-col">
                                                <span>{shipment.shipmentNumber}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {shipment.trackingId}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{shipment.customer}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {shipment.originWarehouse?.name || "N/A"}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {shipment.destinationVendor?.companyName || "N/A"}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell capitalize">
                                            {shipment.type}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {getPriorityBadge(shipment.priority)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(shipment.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewShipment(shipment)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEditShipment(shipment)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteShipment(shipment)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="h-24 text-center">
                                        No shipments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {filteredShipments.length > 0 && (
                    <div className="flex flex-wrap gap-3 items-center justify-between px-4 py-4">
                        <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, filteredShipments.length)} of{" "}
                            {filteredShipments.length} shipments
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}