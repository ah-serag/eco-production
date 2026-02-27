"use client";

import { useState } from "react";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Users, MoreHorizontal, Search, ListOrdered, ShieldCheck, Mail, UserCog, Trash2, Power } from "lucide-react";

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
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin" | "vendor">("all");

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
      toast.success("Role updated successfully");
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

  const totalPages = Math.ceil((data?.total || 0) / limit) || 1;

  return (
    <div className="p-8 bg-slate-50/30 min-h-screen space-y-6">
      <Toaster position="top-right" richColors />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users Manager</h1>
          <p className="text-slate-500 text-sm font-medium">Control user permissions, account status, and platform access.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Accounts: </span>
          <span className="text-sm font-black text-blue-600">{data?.total || 0}</span>
        </div>
      </div>

      {/* Filters Bar - Modified with Manual Limit Input */}
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap gap-4 items-center">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="pl-9 h-10 text-xs border-slate-200"
          />
        </div>

        {/* Limit Input - الكتابة اليدوية الموحدة */}
        <div className="relative w-32">
          <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            type="number"
            placeholder="Limit"
            value={limit}
            onChange={(e) => {
              setPage(1);
              setLimit(Number(e.target.value) || 10);
            }}
            className="pl-9 h-10 text-xs font-bold border-slate-200"
          />
        </div>

        {/* Status Select */}
        <div className="w-32">
          <Select value={status} onValueChange={(val) => { setPage(1); setStatus(val as any); }}>
            <SelectTrigger className="h-10 text-xs font-medium border-slate-200 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role Select */}
        <div className="w-32">
          <Select value={roleFilter} onValueChange={(val) => { setPage(1); setRoleFilter(val as any); }}>
            <SelectTrigger className="h-10 text-xs font-medium border-slate-200 bg-white">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="text-[10px] font-bold uppercase text-slate-400">User Identity</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400">Access Level</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400">Account Status</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400">Verification</TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase text-slate-400 pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-[10px] text-slate-400 tracking-widest uppercase">Fetching Records...</TableCell></TableRow>
            ) : data?.data.map((user: User) => (
              <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-700">{user.full_name}</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Mail size={10} /> {user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                    user.role === "admin" ? "bg-amber-50 text-amber-600 border border-amber-100" : 
                    user.role === "vendor" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                    "bg-slate-100 text-slate-500"
                  )}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", user.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-400")} />
                    <span className="text-[10px] font-bold uppercase text-slate-500">{user.is_active ? "Enabled" : "Disabled"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.is_verified ? (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <ShieldCheck size={12} />
                      <span className="text-[10px] font-black uppercase">Verified</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 uppercase italic">Pending</span>
                  )}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100"><MoreHorizontal size={14} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="text-[10px] font-bold uppercase text-slate-400">Management</DropdownMenuLabel>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-xs cursor-pointer font-medium">
                            <UserCog className="mr-2 h-3.5 w-3.5" /> Modify Account
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                          <DialogHeader><DialogTitle className="text-sm font-bold uppercase">Update User: {user.full_name}</DialogTitle></DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase text-slate-400">Assign Role</label>
                              <Select value={user.role} onValueChange={(val) => handleRoleChange(user.id, val)}>
                                <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">Standard User</SelectItem>
                                  <SelectItem value="vendor">Verified Vendor</SelectItem>
                                  <SelectItem value="admin">Platform Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase text-slate-400">Account Status</label>
                              <Select value={user.is_active ? "active" : "inactive"} onValueChange={(val) => handleActiveToggle(user.id, val === "active")}>
                                <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Enabled (Active)</SelectItem>
                                  <SelectItem value="inactive">Disabled (Locked)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <DropdownMenuSeparator />

                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-xs cursor-pointer font-medium text-rose-600 focus:text-rose-600">
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Permanently
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                          <DialogHeader><DialogTitle className="text-sm font-bold uppercase text-rose-600">Irreversible Action</DialogTitle></DialogHeader>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            To delete <span className="font-bold text-slate-900">{user.full_name}</span>, please type the email <strong>{user.email}</strong> below:
                          </p>
                          <Input placeholder="Verify email address..." id={`confirm-email-${user.id}`} className="h-10 text-xs" />
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="ghost" className="text-[10px] font-bold uppercase">Cancel</Button>
                            <Button variant="destructive" className="text-[10px] font-bold uppercase px-6" onClick={async () => {
                                const input = document.getElementById(`confirm-email-${user.id}`) as HTMLInputElement;
                                if (input.value !== user.email) {
                                  toast.error("Security mismatch: Email is incorrect");
                                  return;
                                }
                                await handleDeleteUser(user.id);
                              }}>Confirm Deletion</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          Directory Overview | Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            PREVIOUS
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            NEXT BATCH
          </Button>
        </div>
      </div>
    </div>
  );
}