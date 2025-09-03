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
        aiAction ? "h-auto max-w-lg" : ""
      )}
    >
      {!aiAction ? (
        <div className="bubble-menu space-x-2 *:hover:cursor-pointer flex">
          <Button type="button" onClick={() => setAiAction("shorten")}>
            Shorten
          </Button>
        </div>
      ) : (
        <ShortenAiAction
          selectedText={getSelectedText()}
          editor={editor}
          onClose={() => setAiAction(undefined)}
        />
      )}
    </BubbleMenu>
  );
};

export default CustomBubbleMenu;

export const ShortenAiAction = ({
  selectedText,
  editor,
  onClose,
}: {
  selectedText: string;
  editor: Editor;
  onClose: () => void;
}) => {
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

  const handleAccept = () => {
    const { from, to } = editor.state.selection;
    editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(shortenedText || "")
      .run();

    onClose();
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex h-full text-sm gap-2 p-2 border rounded-lg *:py-2 *:px-4 *:flex-1 *:space-y-1 *:min-h-full *:flex *:flex-col *:justify-between">
      <div className="border-r">
        <div>
          <p className="mb-3 text-base font-semibold">Original Text:</p>
          <p>{selectedText}</p>
        </div>
        <Button className="mx-auto mt-8" onClick={onClose}>
          Decline
        </Button>
      </div>
      <div>
        <div>
          <p className="mb-3 text-base font-semibold">Shortened Text:</p>
          <p>{shortenedText}</p>
        </div>
        <Button className="mx-auto mt-8" onClick={handleAccept}>
          Accept
        </Button>
      </div>
    </div>
  );
};
