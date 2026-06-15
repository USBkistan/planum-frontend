"use client";

import Cookies from "js-cookie";
import { Send, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

import { SocketMessage } from "@/app/schemas/socket";
import { Comment, CommentCreate, CommentNode } from "@/app/schemas/tasks";
import { UserData } from "@/app/schemas/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { wsServerUrl } from "@/services/globals";
import { buildCommentTree, createTaskComments, getTaskComments } from "@/services/tasks";

const MAX_DEPTH = 3;

const CommentItem = ({
  node,
  onReply,
  depth = 0,
  currentUserId,
}: {
  node: CommentNode;
  onReply: (parentId: string, text: string) => Promise<void>;
  depth?: number;
  currentUserId: string;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReplySubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onReply(node.id, replyText);
      setIsReplying(false);
      setReplyText("");
    } finally {
      setIsLoading(false);
    }
  };

  const isMaxDepth = depth >= MAX_DEPTH;

  return (
    <>
      <div className="mt-4">
        {/* Тело комментария */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-semibold">{node.name}</span>
              </div>
              <span className="text-xs">{new Date(node.created_at).toLocaleString("ru-RU")}</span>
            </div>

            <p className="mb-4 text-sm">{node.text}</p>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs"
              >
                Ответить
              </Button>
            </div>

            {/* Форма ответа */}
            {isReplying && (
              <form onSubmit={handleReplySubmit} className="mt-4 space-y-3">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Напишите ответ..."
                  rows={2}
                  disabled={isLoading}
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={isLoading || !replyText.trim()}>
                    <Send className="mr-1 h-3 w-3" />
                    Отправить
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyText("");
                    }}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Рендер потомков с учетом глубины */}
        {node.children.length > 0 && (
          <div className={isMaxDepth ? "mt-2" : "mt-2 ml-4 border-l-2 pl-4 md:ml-6"}>
            {node.children.map((child) => (
              <CommentItem
                key={child.id}
                node={child}
                onReply={onReply}
                depth={isMaxDepth ? depth : depth + 1}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default function TaskComments({ taskId, user }: { taskId: string; user: UserData }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [mainCommentText, setMainCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const access_token = Cookies.get("access_token")!;
    const ws = new WebSocket(`${wsServerUrl}/tasks/comments?token=${access_token}`);

    ws.onopen = () => console.log("Connected to server");

    ws.onmessage = async (event) => {
      try {
        const socketMessage: SocketMessage = JSON.parse(event.data);
        if (socketMessage.type === "comments_updated") {
          const data = await getTaskComments(taskId);
          setComments(data);
        } else {
          console.log("Received unknown message type:", socketMessage.type);
        }
      } catch (error) {
        console.log(event.data);
      }
    };

    ws.onclose = () => console.log("Disconnected from server");

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTaskComments(taskId);
      setComments(data);
    };

    fetchData();
  }, [taskId]);

  const addComment = async (parentId: string | null, text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const newComment: CommentCreate = {
        task_id: taskId,
        parent_id: parentId,
        text: text,
      };
      await createTaskComments(newComment);

      const socketMessage: SocketMessage = {
        type: "comments_updated",
        payload: {},
      };

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(socketMessage));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const treeRoots = buildCommentTree(comments);

  return (
    <>
      <Card>
        <CardTitle className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <MessageSquare className="h-5 w-5" />
          Комментарии
        </CardTitle>

        <CardContent className="p-4">
          <Textarea
            value={mainCommentText}
            onChange={(e) => setMainCommentText(e.target.value)}
            placeholder="Написать комментарий..."
            rows={3}
            disabled={isLoading}
          />
          <Button
            onClick={() => {
              addComment(null, mainCommentText);
              setMainCommentText("");
            }}
            disabled={isLoading || !mainCommentText.trim()}
            className="mt-3"
          >
            <Send className="mr-2 h-4 w-4" />
            Написать
          </Button>
        </CardContent>
      </Card>
      <div className="space-y-4">
        {treeRoots.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <MessageSquare className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm">Нет комментариев.</p>
          </div>
        ) : (
          treeRoots.map((rootNode) => (
            <CommentItem
              key={rootNode.id}
              node={rootNode}
              onReply={addComment}
              currentUserId={user.id}
            />
          ))
        )}
      </div>
    </>
  );
}
