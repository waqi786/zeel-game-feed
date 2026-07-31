import { AnimatePresence, motion } from "framer-motion";
import { Heart, Send, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  parentId: number | null;
  user: { username: string; avatar: string | null; uuid: string };
  replies: Comment[];
};

type Props = {
  gameUuid: string | null;
  onClose: () => void;
  onAuth: () => void;
};

export function CommentSection({ gameUuid, onClose, onAuth }: Props) {
  const user = useAuthStore((state) => state.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  useEffect(() => {
    if (!gameUuid) return;
    void api.get(`/games/${gameUuid}/comments`).then(({ data }) => setComments(data.comments));
  }, [gameUuid]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return onAuth();
    if (!gameUuid || !content.trim()) return;
    const { data } = await api.post(`/games/${gameUuid}/comments`, {
      content: content.trim(),
      parentId: replyTo?.id
    });
    setContent("");
    setReplyTo(null);
    setComments((items) => appendComment(items, data.comment));
  };

  const removeComment = async (comment: Comment) => {
    if (!gameUuid) return;
    await api.delete(`/games/${gameUuid}/comments/${comment.id}`);
    setComments((items) => deleteCommentById(items, comment.id));
  };

  return (
    <AnimatePresence>
      {gameUuid ? (
        <motion.aside
          key={gameUuid}
          initial={{ y: "100%" }}
          animate={{ y: 0, pointerEvents: "auto" }}
          exit={{ y: "100%", pointerEvents: "none" }}
          transition={{ type: "spring", damping: 32, stiffness: 280 }}
          className="absolute inset-x-0 bottom-0 z-[65] h-[82%] rounded-t-md border-t border-white/10 bg-[#0B0F17]/95 text-white shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex h-full min-h-0 flex-col">
            <header className="shrink-0 border-b border-white/10 px-5 pb-4 pt-3">
              <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/80" />
              <div className="flex items-center justify-between">
              <div />
              <h2 className="text-xl font-black">
                Comments <span className="ml-2 font-semibold text-white/55">{Math.max(comments.length, sampleComments.length)}</span>
              </h2>
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Close comments">
                <X size={24} />
              </button>
              </div>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              {(comments.length ? comments : sampleComments).map((comment) => (
                  <CommentItem key={comment.id} comment={comment} onReply={setReplyTo} onDelete={removeComment} />
                ))}
            </div>
            <form onSubmit={submit} className="shrink-0 border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              {replyTo ? (
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="mb-2 text-xs font-bold text-zeel-primary"
                >
                  Replying to @{replyTo.user.username}
                </button>
              ) : null}
              <div className="flex items-center gap-2">
                <input
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Add a comment..."
                  className="min-w-0 flex-1 rounded-full border-white/10 bg-white/10 px-5 py-4 text-base text-white placeholder:text-white/45 focus:border-zeel-primary focus:ring-zeel-primary"
                />
                <button className="grid h-12 w-12 place-items-center rounded-full bg-zeel-primary text-white shadow-neon" aria-label="Send">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

function CommentItem({
  comment,
  onReply,
  onDelete
}: {
  comment: Comment;
  onReply: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}) {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  return (
    <div className="mb-5">
      <div className="flex gap-4">
        <img src={comment.user.avatar ?? "/zeel-logo.png"} alt="" className="h-12 w-12 rounded-full border border-zeel-primary object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-black">{comment.user.username}</span>
            <span className="text-sm text-white/55">{relativeTime(comment.createdAt)}</span>
            {comment.user.username === "zeel_creator" ? <span className="text-sm font-bold text-zeel-cyan">Creator</span> : null}
          </div>
          <p className="mt-1 break-words text-lg leading-6 text-white/92">{comment.content}</p>
          <div className="mt-3 flex items-center gap-3">
            <button onClick={() => onReply(comment)} className="text-sm font-bold text-white/55">
              Reply
            </button>
            {user?.uuid === comment.user.uuid ? (
              <button
                onClick={() => onDelete(comment)}
                className="inline-flex items-center gap-1 text-xs font-bold text-zeel-primary"
                aria-label="Delete comment"
              >
                <Trash2 size={12} /> Delete
              </button>
            ) : null}
          </div>
        </div>
        <button className="grid min-w-12 place-items-center self-start text-white/75" aria-label="Like comment">
          <Heart size={25} className={comment.id % 2 ? "fill-zeel-primary text-zeel-primary" : ""} />
          <span className="mt-1 text-sm font-bold">{comment.id % 2 ? 24 - (comment.id % 9) : 1 + (comment.id % 16)}</span>
        </button>
      </div>
      {comment.replies.length ? (
        <button onClick={() => setOpen((value) => !value)} className="ml-12 mt-2 text-xs font-bold text-zeel-primary">
          {open ? "Hide" : "View"} {comment.replies.length} replies
        </button>
      ) : null}
      {open ? (
        <div className="ml-6 mt-4 border-l border-zeel-primary/25 pl-10">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} onDelete={onDelete} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

const sampleAvatar = (label: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#09090B"/><circle cx="48" cy="48" r="38" fill="#F50575" opacity=".18"/><path d="M24 67 48 19l24 48-24-14-24 14Z" fill="#F50575"/><text x="48" y="82" fill="#fff" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle">${label}</text></svg>`)}`;

const sampleComments: Comment[] = [
  {
    id: 101,
    content: "This game feels polished and fast.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    parentId: null,
    user: { username: "arcade_master", avatar: sampleAvatar("AM"), uuid: "sample-1" },
    replies: [
      {
        id: 102,
        content: "Thanks. More levels are coming.",
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        parentId: 101,
        user: { username: "zeel_creator", avatar: sampleAvatar("ZC"), uuid: "sample-2" },
        replies: []
      }
    ]
  },
  {
    id: 103,
    content: "The neon design looks premium.",
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    parentId: null,
    user: { username: "pixel_player", avatar: sampleAvatar("PP"), uuid: "sample-3" },
    replies: []
  },
  {
    id: 104,
    content: "Controls are smooth on touch.",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    parentId: null,
    user: { username: "retro_gamer", avatar: sampleAvatar("RG"), uuid: "sample-4" },
    replies: []
  },
  {
    id: 105,
    content: "I just beat my high score.",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    parentId: null,
    user: { username: "level_up", avatar: sampleAvatar("LU"), uuid: "sample-5" },
    replies: []
  }
];

function relativeTime(value: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m`;
  return `${Math.round(minutes / 60)}h`;
}

function appendComment(comments: Comment[], comment: Comment): Comment[] {
  if (!comment.parentId) return [...comments, comment];
  return comments.map((item) =>
    item.id === comment.parentId
      ? { ...item, replies: [...item.replies, comment] }
      : { ...item, replies: appendComment(item.replies, comment) }
  );
}

function deleteCommentById(comments: Comment[], id: number): Comment[] {
  return comments
    .filter((comment) => comment.id !== id)
    .map((comment) => ({ ...comment, replies: deleteCommentById(comment.replies, id) }));
}
