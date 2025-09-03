import { Button } from "@/components/tiptap-ui-primitive/button";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";
import { Loader } from "./ui/loader";

interface Props {
  editor: Editor;
}
const CustomBubbleMenu = ({ editor }: Props) => {
  const [aiAction, setAiAction] = useState<"shorten" | "edit" | undefined>(
    undefined
  );

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "bottom", offset: 8 }}
      className={cn(
        "bg-accent rounded-lg px-1.5 py-1",
        aiAction ? "size-40" : ""
      )}
    >
      {!aiAction ? (
        <div className="bubble-menu space-x-2 *:hover:cursor-pointer flex">
          <Button type="button" onClick={() => setAiAction("shorten")}>
            Shorten
          </Button>
          <Button type="button" onClick={() => setAiAction("edit")}>
            Edit with AI
          </Button>
        </div>
      ) : aiAction === "shorten" ? (
        <ShortenAiAction />
      ) : (
        <EditAiAction />
      )}
    </BubbleMenu>
  );
};

export default CustomBubbleMenu;

const ShortenAiAction = () => {
  const [loading, setLoading] = useState(true);

  return loading ? <Loader /> : <div>Shorten AI Action</div>;
};

const EditAiAction = () => {
  const [loading, setLoading] = useState(true);

  return <div>Edit AI Action</div>;
};
