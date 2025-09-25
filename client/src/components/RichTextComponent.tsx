import {
  MDXEditor,
  markdownShortcutPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  MDXEditorMethods,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  Separator,
  CreateLink,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { grey } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";
import { useRef } from "react";

const useStyles = makeStyles(() => ({
  editor: {
    borderRadius: "8px",
    backgroundColor: grey[50],
    padding: `0 0.6rem`,
    minHeight: "200px",
    width: "100%",
    border: `1px solid ${grey[300]}`,

    "& .mdxeditor-toolbar": {
      backgroundColor: grey[300],
      marginTop: "0.5rem",
      display: "flex",
      flexWrap: "wrap",
      width: "100%",
    },
    "& .mdxeditor-toolbar div": {
      display: "flex",
      flexWrap: "wrap",
    },
    "& .mdxeditor-rich-text-editor": {
      marginTop: "0.5rem",
      minHeight: "200px",
    },
  },
}));

function RichTextComponent({
  onChange,
  placeholder,
}: {
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const classes = useStyles();
  const ref = useRef<MDXEditorMethods>(null);

  return (
    <MDXEditor
      ref={ref}
      markdown={placeholder ?? ""}
      className={classes.editor}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <Separator />
              <CreateLink />
            </>
          ),
        }),
        listsPlugin(),
        quotePlugin(),
        headingsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        tablePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]}
      spellCheck={true}
      onChange={(value) => {
        onChange(value);
      }}
    />
  );
}

export default RichTextComponent;
