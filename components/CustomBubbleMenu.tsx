import { Button } from "@/components/tiptap-ui-primitive/button";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useEffect, useState } from "react";
import { Loader } from "./ui/loader";

interface Props {
  editor: Editor;
}
const CustomBubbleMenu = ({ editor }: Props) => {
  const [aiAction, setAiAction] = useState<"shorten" | undefined>(undefined);

  const getSelectedText = () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    return selectedText;
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => {
        if (!editor.state.selection.empty) {
          return true;
        }
        setAiAction(undefined);
        return false;
      }}
      options={{ placement: "bottom", offset: 8 }}
      className={cn(
        "bg-accent rounded-lg px-1.5 py-1",
        aiAction ? "size-40 min-h-fit" : ""
      )}
    >
      {!aiAction ? (
        <div className="bubble-menu space-x-2 *:hover:cursor-pointer flex">
          <Button type="button" onClick={() => setAiAction("shorten")}>
            Shorten
          </Button>
        </div>
      ) : (
        <ShortenAiAction selectedText={getSelectedText()} />
      )}
    </BubbleMenu>
  );
};

export default CustomBubbleMenu;

export const ShortenAiAction = ({ selectedText }: { selectedText: string }) => {
  const [loading, setLoading] = useState(true);
  const [shortenedText, setShortenedText] = useState<string | null>(null);

  const makeAiCall = async () => {
    const res = await fetch("/api/shorten", {
      method: "POST",
      body: JSON.stringify({
        prompt: selectedText,
      }),
    });

    const { text } = await res.json();
    setShortenedText(text);
    setLoading(false);
  };

  useEffect(() => {
    makeAiCall();
  }, [selectedText]);

  return loading ? <Loader /> : <div>{shortenedText}</div>;
};
