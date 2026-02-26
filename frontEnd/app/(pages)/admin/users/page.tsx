"use client";

import { useState } from "react";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserActiveMutation,
  useDeleteUserMutation
} from "../../../../redux/features/users/usersapiSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// Import Dropdown components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// Import MoreHorizontal icon
import { Users, MoreHorizontal } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");

  const offset = (page - 1) * limit;

  const { data, isLoading, error } = useGetUsersQuery({
    offset,
    limit,
    search,
    status: status === "all" ? null : status,
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  const [updateRole] = useUpdateUserRoleMutation();
  const [toggleActive] = useToggleUserActiveMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateRole({ id, role }).unwrap();
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleActiveToggle = async (id: string, is_active: boolean) => {
    try {
      await toggleActive({ id, is_active }).unwrap();
      toast.success("User status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen">
      <div className="relative overflow-hidden rounded-md  p-6 md:p-10  text-white bg-secondary">
    

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-start md:items-center gap-4 md:gap-6 max-w-xl">
           <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white/20">
              <Users  className="w-8 h-8"  />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Users Manager</h2>
              <p className="text-sm text-gray-300">
                Manage users efficiently, update roles, activate/deactivate accounts, and verify user status with ease.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-gray-300 text-xs">Search Users</label>
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                className="w-64 bg-white text-black"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-300 text-xs">Show per page</label>
              <Select value={limit.toString()} onValueChange={(val) => { setPage(1); setLimit(Number(val)); }}>
                <SelectTrigger className="w-24 bg-white text-black">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-300 text-xs">Status</label>
              <Select value={status} onValueChange={(val) => { setPage(1); setStatus(val as "all" | "active" | "inactive"); }}>
                <SelectTrigger className="w-28 bg-white text-black">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-300 text-xs">Role</label>
              <Select value={roleFilter} onValueChange={(val) => { setPage(1); setRoleFilter(val as "all" | "user" | "admin"); }}>
                <SelectTrigger className="w-28 bg-white text-black">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="vendor">vendor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? <p className="text-gray-500">Loading...</p> : error ? <p className="text-red-500">Error loading users</p> : (
        <div className="overflow-x-auto  shadow-md bg-white">
          <Table>
            <TableHeader>
            <TableRow className="bg-gray-100 ">
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((user: User) => (
                <TableRow key={user.id} className="hover:bg-gray-50 transition">
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize ">{user.role}</TableCell>
                  <TableCell>
                    <div className={`w-2 h-2 rounded-full ${user.is_active ? "bg-green-500" : "bg-red-500"}`} />
                  </TableCell>
                  <TableCell>
                    <span className={`p-1 px-2  text-[11px] rounded-md   ${user.is_verified ? "bg-secondary text-white" : "bg-gray-700 text-white"}`}>
                      {user.is_verified ? "Verified" : "Not Verified"}
                    </span>
                  </TableCell>
                  
                  {/* --- Start of Modified Action Column --- */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        
                        {/* Edit Dialog - Wrapped in Dropdown Item */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={user.role === "Super Admin"}>
                               Edit User
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
                            <div className="flex flex-col gap-4 mt-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold">Role</label>
                                <Select value={user.role} onValueChange={(val) => handleRoleChange(user.id, val)}>
                                  <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="vendor">vendor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold">Active</label>
                                <Select value={user.is_active ? "active" : "inactive"} onValueChange={(val) => handleActiveToggle(user.id, val === "active")}>
                                  <SelectTrigger><SelectValue placeholder="Active" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Dialog - Wrapped in Dropdown Item */}
                        <Dialog>
                          <DialogTrigger asChild>
                             <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()} 
                                disabled={ user.role === "Super Admin"}
                                className="text-red-600 focus:text-red-600"
                              >
                               Delete User
                             </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-sm">
                            <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
                            <p className="text-sm mt-2">
                              To delete <span className="font-semibold">{user.full_name}</span>, type their email below:
                            </p>
                            <Input placeholder="Enter user email..." id={`confirm-email-${user.id}`} className="mt-2" />
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline" onClick={() => {
                                const input = document.getElementById(`confirm-email-${user.id}`) as HTMLInputElement;
                                if(input) input.value = "";
                              }}>Cancel</Button>
                              <Button variant="destructive" onClick={async () => {
                                const input = document.getElementById(`confirm-email-${user.id}`) as HTMLInputElement;
                                if (input.value !== user.email) {
                                  toast.error("Email does not match!");
                                  return;
                                }
                                await handleDeleteUser(user.id);
                                input.value = "";
                              }}>Delete</Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  {/* --- End of Modified Action Column --- */}

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
        <span className="text-gray-700 font-medium">Page {page} of {Math.ceil((data?.total || 0) / limit)}</span>
        <Button variant="outline" disabled={page >= Math.ceil((data?.total || 0) / limit)} onClick={() => setPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}