"use client";

import { useState } from "react";
import {
  Table, TableHeader, TableRow, TableCell,
  TableBody, TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserActiveMutation,
  useDeleteUserMutation,
} from "../../../../../redux/features/users/usersapiSlice";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  MoreHorizontal, Search, Users, ShieldAlert,
  UserCog, Trash2, Phone, Clock, ChevronLeft,
  ChevronRight, UserCheck, UserX,
} from "lucide-react";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const colors = [
    "bg-violet-100 text-violet-600",
    "bg-sky-100 text-sky-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600",
    "bg-rose-100 text-rose-600",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0", color)}>
      {initials}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin:  "bg-amber-50 text-amber-700 border-amber-200",
    vendor: "bg-sky-50 text-sky-700 border-sky-200",
    user:   "bg-slate-50 text-slate-500 border-slate-200",
  };
  return (
    <span className={cn(
      "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border",
      styles[role] ?? "bg-slate-50 text-slate-500 border-slate-200"
    )}>
      {role}
    </span>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn(
        "w-1.5 h-1.5 rounded-full ring-2 ring-offset-1",
        active ? "bg-emerald-500 ring-emerald-100" : "bg-rose-400 ring-rose-100"
      )} />
      <span className={cn(
        "text-[10px] font-semibold",
        active ? "text-emerald-600" : "text-rose-500"
      )}>
        {active ? "Active" : "Inactive"}
      </span>
    </div>
  );
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function UsersPage() {
  const [page, setPage]           = useState(1);
  const [limit]                   = useState(10);
  const [search, setSearch]       = useState("");
  const [status, setStatus]       = useState<"all" | "active" | "inactive">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin" | "vendor">("all");

  const offset = (page - 1) * limit;

  const { data, isLoading } = useGetUsersQuery({
    offset, limit, search,
    status:  status     === "all" ? null      : status,
    role:    roleFilter === "all" ? undefined : roleFilter,
  });

  const [updateRole]   = useUpdateUserRoleMutation();
  const [toggleActive] = useToggleUserActiveMutation();
  const [deleteUser]   = useDeleteUserMutation();

  const totalPages = Math.ceil((data?.total || 0) / limit) || 1;

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateRole({ id, role }).unwrap();
      toast.success("Role updated", { description: `User role changed to ${role}.` });
    } catch { toast.error("Failed to update role"); }
  };

  const handleActiveToggle = async (id: string, is_active: boolean) => {
    try {
      await toggleActive({ id, is_active }).unwrap();
      toast.info(is_active ? "Account enabled" : "Account disabled");
    } catch { toast.error("Failed to update status"); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
    } catch { toast.error("Could not delete user"); }
  };

  const activeCount   = data?.data?.filter((u: User) => u.is_active).length  ?? 0;
  const inactiveCount = data?.data?.filter((u: User) => !u.is_active).length ?? 0;

  return (
    <div className="p-6 bg-[#f8f8f8] min-h-screen space-y-5 font-sans">
      <Toaster position="top-right" richColors />

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Users</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Manage accounts, roles, and access.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm">
            <Users size={13} className="text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-600">{data?.total ?? "—"}</span>
            <span className="text-[10px] text-slate-300 font-medium">total</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            <UserCheck size={13} className="text-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-600">{activeCount}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
            <UserX size={13} className="text-rose-400" />
            <span className="text-[11px] font-semibold text-rose-500">{inactiveCount}</span>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
          <Input
            placeholder="Search by name or email or id"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="pl-9 h-9 text-[12px] bg-white border-slate-200 shadow-sm rounded-xl focus-visible:ring-slate-300"
          />
        </div>

        <Select value={status} onValueChange={(v) => { setPage(1); setStatus(v as any); }}>
          <SelectTrigger className="h-9 w-36 text-[11px] font-semibold bg-white border-slate-200 shadow-sm rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-[11px]" value="all">All Status</SelectItem>
            <SelectItem className="text-[11px]" value="active">Active</SelectItem>
            <SelectItem className="text-[11px]" value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={(v) => { setPage(1); setRoleFilter(v as any); }}>
          <SelectTrigger className="h-9 w-36 text-[11px] font-semibold bg-white border-slate-200 shadow-sm rounded-xl">
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

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70 border-b border-slate-100 hover:bg-slate-50/70">
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-5">User</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Joined</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Login</TableHead>
              <TableHead className="h-10 w-12 pr-5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-slate-50">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j} className="py-4">
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-20 text-center">
                  <Users size={28} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-[11px] font-semibold text-slate-400">No users found</p>
                </TableCell>
              </TableRow>
            ) : data?.data?.map((user: User) => (
              <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/40 transition-colors">

                {/* User */}
                <TableCell className="pl-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.full_name} />
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-slate-800 truncate">{user.full_name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Phone */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    {user.phone
                      ? <><Phone size={10} className="text-slate-300" />{user.phone}</>
                      : <span className="text-slate-300">—</span>
                    }
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell><RoleBadge role={user.role} /></TableCell>

                {/* Status */}
                <TableCell><StatusDot active={user.is_active} /></TableCell>

                {/* Joined */}
                <TableCell>
                  <span className="text-[11px] text-slate-500">{formatDate(user.created_at)}</span>
                </TableCell>

                {/* Last Login */}
                <TableCell>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    {user.last_login
                      ? <><Clock size={10} className="text-slate-300" />{formatDate(user.last_login)}</>
                      : <span className="text-slate-300">Never</span>
                    }
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="pr-5 text-right">
                  {user.role !== "Super Admin" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"
                          className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                          <MoreHorizontal size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 shadow-lg border-slate-100 rounded-xl">
                        <DropdownMenuLabel className="text-[9px] font-bold uppercase text-slate-400 tracking-wider py-2">
                          Actions
                        </DropdownMenuLabel>

                        {/* Edit Permissions */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}
                              className="text-[12px] font-medium cursor-pointer py-2 rounded-lg focus:bg-slate-50">
                              <UserCog className="mr-2 h-3.5 w-3.5 text-slate-400" /> Edit Permissions
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-xs rounded-2xl border-none shadow-2xl p-6">
                            <DialogHeader>
                              <div className="flex items-center gap-3 mb-1">
                                <Avatar name={user.full_name} />
                                <div>
                                  <DialogTitle className="text-[13px] font-semibold text-slate-900">
                                    {user.full_name}
                                  </DialogTitle>
                                  <p className="text-[10px] text-slate-400">{user.email}</p>
                                </div>
                              </div>
                            </DialogHeader>
                            <div className="space-y-4 pt-2">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Role</label>
                                <Select value={user.role} onValueChange={(val) => handleRoleChange(user.id, val)}>
                                  <SelectTrigger className="h-9 text-[12px] rounded-xl border-slate-200">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl">
                                    <SelectItem className="text-[12px]" value="user">User</SelectItem>
                                    <SelectItem className="text-[12px]" value="vendor">Vendor</SelectItem>
                                    <SelectItem className="text-[12px]" value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Account Status</label>
                                <Select
                                  value={user.is_active ? "active" : "inactive"}
                                  onValueChange={(val) => handleActiveToggle(user.id, val === "active")}
                                >
                                  <SelectTrigger className="h-9 text-[12px] rounded-xl border-slate-200">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl">
                                    <SelectItem className="text-[12px]" value="active">Active</SelectItem>
                                    <SelectItem className="text-[12px]" value="inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <DropdownMenuSeparator className="my-1" />

                        {/* Delete */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}
                              className="text-[12px] font-medium cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50 py-2 rounded-lg">
                              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete User
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-xs rounded-2xl border-none shadow-2xl p-6">
                            <DialogHeader className="flex flex-col items-center gap-3 mb-1">
                              <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center">
                                <ShieldAlert className="text-rose-500" size={20} />
                              </div>
                              <DialogTitle className="text-[13px] font-semibold text-slate-900">Delete User</DialogTitle>
                            </DialogHeader>
                            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                              Type the email of <span className="font-semibold text-slate-800">{user.full_name}</span> to confirm deletion.
                            </p>
                            <Input
                              id={`confirm-${user.id}`}
                              placeholder={user.email}
                              className="h-9 text-[11px] text-center border-slate-200 rounded-xl mt-2"
                            />
                            <div className="flex gap-2 mt-4">
                              <DialogClose asChild>
                                <Button variant="outline" className="flex-1 h-9 text-[11px] rounded-xl">Cancel</Button>
                              </DialogClose>
                              <Button variant="destructive" className="flex-1 h-9 text-[11px] rounded-xl"
                                onClick={async () => {
                                  const input = document.getElementById(`confirm-${user.id}`) as HTMLInputElement;
                                  if (input.value !== user.email) {
                                    toast.error("Email doesn't match");
                                    return;
                                  }
                                  await handleDelete(user.id);
                                }}>
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] text-slate-400">
          Page <span className="font-semibold text-slate-600">{page}</span> of <span className="font-semibold text-slate-600">{totalPages}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon"
            className="h-8 w-8 rounded-xl border-slate-200 shadow-sm hover:bg-white"
            disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft size={13} />
          </Button>
          <Button variant="outline" size="icon"
            className="h-8 w-8 rounded-xl border-slate-200 shadow-sm hover:bg-white"
            disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight size={13} />
          </Button>
        </div>
      </div>

    </div>
  );
}
