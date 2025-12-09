import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs().format();
dayjs.extend(relativeTime);

import type { CommentType, InteractionType } from "@/types";
import { Link } from "react-router";
import { Button } from "./button";
import { ArrowBigDown, ArrowBigUp, ChevronDown, ChevronUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/store/auth";
import { Input } from "./input";
import { useState } from "react";
import { toast } from "sonner";

const CommentCard = ({
  videoId,
  comment,
  interactions,
  onVote,
}: {
  videoId: string | null;
  comment: CommentType;
  interactions: InteractionType[] | undefined | null;
  onVote: () => void;
}) => {
  const formattedDate = dayjs(comment?.createdAt).fromNow();
  const axiosPrivate = useAxiosPrivate();
  const { user } = useAuth();

  const [replyBtnText, setReplyBtnText] = useState("Reply");
  const [replyContent, setReplyContent] = useState("");

  const [showReplies, setShowReplies] = useState(0);

  const [commentReplies, setCommentReplies] = useState<CommentType[] | []>([]);

  const makeCommentVote = useMutation({
    mutationFn: async (action: number) => {
      if (!videoId) return;
      const response = await axiosPrivate.post(
        `interaction/toggle/c?videoId=${videoId}&action=${action}&commentId=${comment._id}`
      );
      onVote();
      return response.data;
    },
  });

  const sendCommentReply = useMutation({
    mutationFn: async () => {
      if (!videoId) return;
      const response = await axiosPrivate.post(
        `/comments?videoId=${videoId}&message=${replyContent}&commentTo=${comment._id}`
      );
      return response.data;
    },
  });

  const handleSendCommentReply = async () => {
    if (replyBtnText !== "Send") return;
    if (replyContent.trim().length === 0) {
      toast.error("Reply content cannot be empty.");
      return;
    }
    try {
      await sendCommentReply.mutateAsync();
      setReplyContent("");
      setReplyBtnText("Reply");
      toast.success("Reply sent successfully!");
    } catch (error) {
      console.log(
        "CommentCard :: error while sending comment reply",
        comment._id,
        error
      );
    }
  };

  const handleFetchReplies = async () => {
    if (!videoId) return;
    const response = await axiosPrivate.get(
      `/comments/replies?commentId=${comment._id}`
    );
    setCommentReplies(response.data.data.docs);
  };

  return (
    <div>
      <div className="flex items-start gap-3 mb-4">
        <Link to={`/user/${comment.user_id}`}>
          <Avatar className="group">
            <AvatarImage
              src={comment.avatar}
              alt={comment.fullName}
              className="group"
            />
            <AvatarFallback>{comment.fullName[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <p className="hover:underline group-hover:underline">
              @{comment.username}
            </p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
          <p>{comment.content}</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="[&>*+*]:border-l-0">
              <Button
                type="button"
                onClick={() => makeCommentVote.mutate(1)}
                variant="outline"
                size={"sm"}
                className="rounded-none w-fit h-7 first:rounded-l-md last:rounded-r-md gap-1 px-3.5 font-semibold hover:bg-green-600/20 hover:text-green-600"
              >
                <ArrowBigUp
                  fill={
                    interactions?.some(
                      (interaction: InteractionType) =>
                        interaction.user_id === user?.data?._id &&
                        interaction.action === 1 &&
                        interaction.commentId === comment._id
                    )
                      ? "currentColor"
                      : "none"
                  }
                  className="h-5! w-5!"
                />
                {interactions?.filter(
                  (interaction: InteractionType) =>
                    interaction.action === 1 &&
                    interaction.commentId === comment._id
                )?.length || ""}
              </Button>
              <Button
                type="button"
                onClick={() => makeCommentVote.mutate(-1)}
                variant="outline"
                className="rounded-none w-7 h-7 first:rounded-l-md font-semibold last:rounded-r-md hover:bg-rose-500/20 hover:text-rose-500"
              >
                <ArrowBigDown
                  fill={
                    interactions?.some(
                      (interaction: InteractionType) =>
                        interaction.user_id === user?.data?._id &&
                        interaction.action === -1 &&
                        interaction.commentId === comment._id
                    )
                      ? "currentColor"
                      : "none"
                  }
                  className="h-5! w-5!"
                />
              </Button>
            </div>
            <div className="flex gap-3">
              {replyBtnText === "Send" && (
                <Input
                  type="text"
                  placeholder="Add a reply..."
                  className="h-7"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
              )}
              <Button
                variant="outline"
                size={"sm"}
                className="rounded-md h-7 font-semibold"
                onClick={() => {
                  setReplyBtnText((prev) =>
                    prev === "Reply" ? "Send" : "Reply"
                  );
                  handleSendCommentReply();
                }}
              >
                {replyBtnText}
              </Button>
            </div>
          </div>
          {/* {comment?.replies} */}
          <div>
            {comment?.replies > 0 && (
              <Button
                variant="link"
                size={"sm"}
                className="mt-2 px-0"
                onClick={() => {
                  if (showReplies === 0) handleFetchReplies();
                  setShowReplies((prev) => {
                    if (prev === 2) return 1;
                    if (prev === 1) return 2;
                    else return 1;
                  });
                }}
              >
                {/* {showReplies ? "Hide Replies" : `Show Replies`} */}
                {showReplies === 0 && (
                  <p className="flex items-center gap-1">
                    <ChevronDown />
                    Show Replies
                  </p>
                )}
                {showReplies === 1 && (
                  <p className="flex items-center gap-1">
                    <ChevronUp />
                    Hide Replies
                  </p>
                )}
                {showReplies === 2 && (
                  <p className="flex items-center gap-1">
                    <ChevronDown />
                    Show Replies
                  </p>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="border-l-2 border-muted-foreground/20 ml-10 pl-3">
        {showReplies === 1 &&
          commentReplies?.map((comment: CommentType) => (
            <div key={comment._id}>
              <CommentCard
                videoId={videoId}
                comment={comment}
                interactions={interactions}
                onVote={onVote}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentCard;
