"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";
import {
  Copy, Trash2, Search, Calendar, Video,
  X, ChevronLeft, ChevronRight, Package, ShieldAlert,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectTrigger, SelectContent,
  SelectItem, SelectValue,
} from "@/components/ui/select";
import {
  useGetVideosQuery,
  useDeleteVideoMutation,
} from "../../../../../../redux/features/AdminVideos/AdminVideosSclice";

interface VideoItem {
  video_id: number;
  video_url: string;
  created_at: string;
  product_id: number | null;
  is_main: boolean;
  public_id: string;
  product_title: string | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function VideosTablePage() {
  const [page, setPage]       = useState(1);
  const [limit]               = useState(10);
  const [sort, setSort]       = useState("desc");
  const [search, setSearch]   = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const { data, isLoading } = useGetVideosQuery({ page, limit, sort, search });
  const [deleteVideo]        = useDeleteVideoMutation();

  const videos: VideoItem[] = data?.videos     || [];
  const totalPages           = data?.totalPages || 1;
  const totalAssets          = data?.total      || 0;

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteVideo(id).unwrap();
      toast.success(res.message || "Video deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not delete video");
    }
  };

  return (
    <div className="p-6 bg-[#f8f8f8] min-h-screen space-y-5 font-sans">
      <Toaster position="top-right" richColors />

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Video Library</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Manage all uploaded videos and their product assignments.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl px-3 py-2 shadow-sm">
          <Video size={13} className="text-slate-400" />
          <span className="text-[11px] font-semibold text-slate-600">{totalAssets}</span>
          <span className="text-[10px] text-slate-300 font-medium">total</span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
          <Input
            placeholder="Search by product title…"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            className="pl-9 h-9 text-[12px] bg-white border-slate-200 shadow-sm rounded-xl focus-visible:ring-slate-300"
          />
        </div>

        <Select value={sort} onValueChange={(v) => { setPage(1); setSort(v); }}>
          <SelectTrigger className="h-9 w-40 text-[11px] font-semibold bg-white border-slate-200 shadow-sm rounded-xl">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-[11px]" value="desc">Newest first</SelectItem>
            <SelectItem className="text-[11px]" value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70 border-b border-slate-100 hover:bg-slate-50/70">
              <TableHead className="h-10 w-20 text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-5">Preview</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Details</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uploaded</TableHead>
              <TableHead className="h-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignment</TableHead>
              <TableHead className="h-10 w-24 text-[10px] font-bold text-slate-400 uppercase tracking-wider pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="border-slate-50">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j} className="py-4">
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : videos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <Video size={28} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-[11px] font-semibold text-slate-400">No videos found</p>
                </TableCell>
              </TableRow>
            ) : videos.map((vid) => (
              <TableRow key={vid.video_id} className="border-slate-50 hover:bg-slate-50/40 transition-colors">

                {/* Preview thumbnail */}
                <TableCell className="pl-5 py-3">
                  <button
                    onClick={() => setPreview(vid.video_url)}
                    className="w-11 h-11 rounded-xl border border-slate-100 bg-slate-900 overflow-hidden flex items-center justify-center hover:border-slate-300 transition-colors relative group/thumb"
                  >
                    <video
                      src={vid.video_url}
                      className="max-w-full max-h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                      <Video size={14} className="text-white" />
                    </div>
                  </button>
                </TableCell>

                {/* Details */}
                <TableCell>
                  <div className="space-y-0.5 max-w-[280px]">
                    <p className="text-[10px] text-slate-400 font-mono">ID: {vid.video_id}</p>
                    <button
                      onClick={() => copyToClipboard(vid.video_url)}
                      className="text-[10px] text-sky-500 hover:text-sky-700 font-mono truncate max-w-full block text-left underline underline-offset-2 transition-colors"
                    >
                      {vid.video_url}
                    </button>
                    <p className="text-[9px] text-slate-300 font-mono truncate">{vid.public_id}</p>
                  </div>
                </TableCell>

                {/* Date */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Calendar size={10} className="text-slate-300 shrink-0" />
                    <div>
                      <p className="font-medium">{formatDate(vid.created_at)}</p>
                      <p className="text-[10px] text-slate-400">{formatTime(vid.created_at)}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Assignment */}
                <TableCell>
                  {vid.product_title ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Package size={10} className="text-slate-300 shrink-0" />
                        <span className="text-[11px] font-medium text-slate-700 truncate max-w-40">
                          {vid.product_title}
                        </span>
                      </div>
                      {vid.is_main && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">
                          Main
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                      Unlinked
                    </span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="pr-5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button size="icon" variant="outline"
                      className="h-7 w-7 rounded-lg border-slate-200 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-colors"
                      onClick={() => copyToClipboard(vid.video_url)}>
                      <Copy size={12} />
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="outline"
                          className="h-7 w-7 rounded-lg border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors">
                          <Trash2 size={12} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xs rounded-2xl border-none shadow-2xl p-6">
                        <DialogHeader className="flex flex-col items-center gap-3 mb-2">
                          <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center">
                            <ShieldAlert className="text-rose-500" size={20} />
                          </div>
                          <DialogTitle className="text-[13px] font-semibold text-slate-900">Delete Video</DialogTitle>
                        </DialogHeader>
                        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                          This will permanently remove the video from cloud storage. This action cannot be undone.
                        </p>
                        <div className="flex gap-2 mt-4">
                          <DialogClose asChild>
                            <Button variant="outline" className="flex-1 h-9 text-[11px] rounded-xl">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button variant="destructive" className="flex-1 h-9 text-[11px] rounded-xl"
                              onClick={() => handleDelete(vid.video_id)}>
                              Delete
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] text-slate-400">
          Page <span className="font-semibold text-slate-600">{page}</span> of{" "}
          <span className="font-semibold text-slate-600">{totalPages}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon"
            className="h-8 w-8 rounded-xl border-slate-200 shadow-sm hover:bg-white"
            disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft size={13} />
          </Button>
          <Button variant="outline" size="icon"
            className="h-8 w-8 rounded-xl border-slate-200 shadow-sm hover:bg-white"
            disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight size={13} />
          </Button>
        </div>
      </div>

      {/* ── Video Preview Modal ── */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/95 border-none shadow-2xl rounded-2xl">
          <DialogTitle className="sr-only">Video Preview</DialogTitle>
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={() => setPreview(null)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <div className="aspect-video w-full">
            {preview && (
              <video
                src={preview}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
