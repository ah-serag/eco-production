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
  DialogClose,
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
import { MoreHorizontal, Search, ListOrdered, ShieldCheck, Mail, UserCog, Trash2, ShieldAlert, Fingerprint } from "lucide-react";

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

  const { data, isLoading } = useGetUsersQuery({
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
      toast.success("Identity Updated", { description: `User is now assigned as ${role}.` });
    } catch {
      toast.error("Update Failed");
    }
  };

  const handleActiveToggle = async (id: string, is_active: boolean) => {
    try {
      await toggleActive({ id, is_active }).unwrap();
      toast.info("Status Changed", { description: `Account is now ${is_active ? 'Enabled' : 'Locked'}.` });
    } catch {
      toast.error("Status Update Failed");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("Purged", { description: "User record removed from core database." });
    } catch {
      toast.error("Deletion Blocked");
    }
  };

  const totalPages = Math.ceil((data?.total || 0) / limit) || 1;

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen space-y-6 text-slate-600 font-sans">
      <Toaster position="top-right" richColors />

      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">Users Manager</h1>
          <p className="text-slate-400 text-[11px] font-semibold tracking-tight uppercase">Platform permissions and identity control.</p>
        </div>
        <div className=" border bg-transparent rounded-lg px-4 py-1.5  text-right">
           <span className="text-[10px] text-slate-400 font-black m-2 leading-tight uppercase tracking-wider">Total Directory :</span>
           <span className="text-sm font-semibold text-chart-1 tracking-tighter">
             {(data?.total || 0).toLocaleString()} <span className="text-slate-900 m-1 text-[12px]">Profiles</span>
           </span>
        </div>
      </div>
       <hr />
      {/* Filters Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <Input
            placeholder="Search identity by name or email..."
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="pl-9 h-9 text-[11px] font-semibold border rounded-lg bg-white shadow-sm focus:border-slate-400"
          />
        </div>

        <div className="bg-white border rounded-lg px-3 py-1 shadow-sm flex items-center gap-2 h-9">
          <ListOrdered size={14} className="text-slate-300" />
          <input
            type="number"
            value={limit}
            onChange={(e) => { setPage(1); setLimit(Number(e.target.value) || 10); }}
            className="w-8 text-[11px] font-bold bg-transparent outline-none text-slate-600"
          />
        </div>

        <Select value={status} onValueChange={(val) => { setPage(1); setStatus(val as any); }}>
          <SelectTrigger className="h-9 w-32 text-[11px] font-bold border rounded-lg bg-white shadow-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-[11px]" value="all">Global Status</SelectItem>
            <SelectItem className="text-[11px]" value="active">Enabled</SelectItem>
            <SelectItem className="text-[11px]" value="inactive">Disabled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={(val) => { setPage(1); setRoleFilter(val as any); }}>
          <SelectTrigger className="h-9 w-32 text-[11px] font-bold border rounded-lg bg-white shadow-sm">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-[11px]" value="all">All Roles</SelectItem>
            <SelectItem className="text-[11px]" value="user">User</SelectItem>
            <SelectItem className="text-[11px]" value="vendor">Vendor</SelectItem>
            <SelectItem className="text-[11px]" value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 pl-6 uppercase tracking-wider">User Identity</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Level</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Verification</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Account State</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Querying Identity DB...</TableCell></TableRow>
            ) : data?.data.map((user: User) => (
              <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <TableCell className="pl-6">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{user.full_name}</span>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 mt-0.5">
                      <Fingerprint size={10} className="text-slate-300" /> {user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border shadow-sm",
                    user.role === "admin" ? "bg-amber-50 text-gray-600 border-amber-100" : 
                    user.role === "vendor" ? "bg-blue-50 text-gray-600 border-blue-100" :
                    "bg-slate-50 text-slate-500 border-slate-100"
                  )}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {user.is_verified ? (
                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-100/50">
                        <ShieldCheck size={10} />
                        <span className="text-[8px] font-black uppercase">Identity Verified</span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-300 uppercase italic tracking-tighter">Unverified</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full ring-2 ring-offset-1", user.is_active ? "bg-emerald-500 ring-emerald-100" : "bg-rose-400 ring-rose-100")} />
                    <span className="text-[10px] font-bold uppercase text-slate-500">{user.is_active ? "Live" : "Locked"}</span>
                  </div>
                </TableCell>
                {user.role === "Super Admin" ? "" : 
                   <TableCell  className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-white border-transparent hover:border-slate-200 border transition-all"><MoreHorizontal size={14} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 shadow-xl border-slate-200">
                      <DropdownMenuLabel className="text-[9px] font-black uppercase text-slate-400 py-2">Security Ops</DropdownMenuLabel>
                      
                      <Dialog >
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-[11px] cursor-pointer font-bold py-2 focus:bg-slate-50">
                            <UserCog className="mr-2 h-3.5 w-3.5 text-gray-500" /> Permissions
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs border-none shadow-2xl p-6">
                          <DialogHeader><DialogTitle className="text-xs font-black uppercase text-slate-900 tracking-widest">Update Permissions</DialogTitle></DialogHeader>
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <label className="text-[9px] font-semibold uppercase text-slate-400 tracking-widest">Global Role</label>
                              <Select value={user.role} onValueChange={(val) => handleRoleChange(user.id, val)}>
                                <SelectTrigger className="h-9 text-[11px] font-bold"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem className="text-[11px]" value="user">Standard User</SelectItem>
                                  <SelectItem className="text-[11px]" value="vendor">Verified Vendor</SelectItem>
                                  <SelectItem className="text-[11px]" value="admin">Platform Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Account State</label>
                              <Select value={user.is_active ? "active" : "inactive"} onValueChange={(val) => handleActiveToggle(user.id, val === "active")}>
                                <SelectTrigger className="h-9 text-[11px] font-bold"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem className="text-[11px]" value="active">Enabled (Active)</SelectItem>
                                  <SelectItem className="text-[11px]" value="inactive">Locked (Restricted)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <DropdownMenuSeparator />

                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-[11px] cursor-pointer font-bold text-rose-600 focus:text-rose-600 py-2 focus:bg-rose-50/50">
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Permanent Termination
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs border-none shadow-2xl p-6">
                          <DialogHeader className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                                <ShieldAlert className="text-rose-600" size={20} />
                            </div>
                            <DialogTitle className="text-xs font-black uppercase text-rose-600 tracking-widest">Destructive Action</DialogTitle>
                          </DialogHeader>
                          <p className="text-[10px] text-slate-500 text-center leading-relaxed font-semibold">
                            Verify deletion for <span className="text-slate-900">{user.full_name}</span> by typing the email below:
                          </p>
                          <Input placeholder="Confirm email..." id={`confirm-email-${user.id}`} className="h-9 text-[11px] font-mono text-center border-rose-100" />
                          <div className="flex gap-2 mt-4">
                            <DialogClose asChild><Button variant="ghost" className="flex-1 text-[10px] font-black uppercase">Cancel</Button></DialogClose>
                            <Button variant="destructive" className="flex-1 text-[10px] font-black uppercase" onClick={async () => {
                                const input = document.getElementById(`confirm-email-${user.id}`) as HTMLInputElement;
                                if (input.value !== user.email) {
                                  toast.error("Security Mismatch", { description: "Email entry does not match user record." });
                                  return;
                                }
                                await handleDeleteUser(user.id);
                              }}>Confirm</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                }
             
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center px-2 pt-2">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
          Directory Integrity | Page {page} of {totalPages}
        </p>
        <div className="flex gap-1.5">
          <Button variant="outline" className="h-7 px-3 text-[9px] font-black border-slate-200 hover:bg-white transition-all uppercase tracking-widest" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button variant="outline" className="h-7 px-3 text-[9px] font-black border-slate-200 hover:bg-white transition-all uppercase tracking-widest" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next Batch
          </Button>
        </div>
      </div>
    </div>
  );
}