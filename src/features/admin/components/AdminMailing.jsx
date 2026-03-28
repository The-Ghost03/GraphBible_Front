import { useState } from "react";
import {
  Send,
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function AdminMailing() {
  const [mailSubject, setMailSubject] = useState("");
  const [isSendingMail, setIsSendingMail] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
    ],
    content: "<p>Bonjour à tous,</p><p>Voici les dernières nouveautés...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none p-5 min-h-[300px] outline-none text-slate-800",
      },
    },
  });

  const handleSendMail = async (e) => {
    e.preventDefault();
    const mailBody = editor.getHTML();

    if (!mailSubject.trim() || mailBody === "<p></p>")
      return toast.error("Remplissez tous les champs.");
    if (
      !window.confirm(
        "Envoyer cet e-mail HTML à TOUS les utilisateurs actifs ?",
      )
    )
      return;

    setIsSendingMail(true);
    const toastId = toast.loading("Envoi de la campagne en cours...");
    try {
      const res = await api.post("/admin/mailing", {
        subject: mailSubject,
        message: mailBody,
      });
      toast.success(res.data.message, { id: toastId });
      setMailSubject("");
      editor.commands.setContent("<p>Nouveau message...</p>");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur lors de l'envoi.", {
        id: toastId,
      });
    } finally {
      setIsSendingMail(false);
    }
  };

  const addImage = () => {
    const url = window.prompt(
      "Collez l'URL publique de votre image (ex: https://.../image.png)",
    );
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Send className="text-blue-500" /> Envoyer une Newsletter
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          L'e-mail sera envoyé à tous les comptes vérifiés et non bannis.
        </p>
      </div>

      <form onSubmit={handleSendMail} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Sujet de l'e-mail
          </label>
          <input
            type="text"
            value={mailSubject}
            onChange={(e) => setMailSubject(e.target.value)}
            disabled={isSendingMail}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            placeholder="Ex: Grosse mise à jour sur BibleGraph ! 🎉"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Corps du message (HTML)
          </label>
          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
            {/* BARRE D'OUTILS */}
            {editor && (
              <div className="flex flex-wrap gap-1 p-2 bg-white border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded transition-colors ${editor.isActive("bold") ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded transition-colors ${editor.isActive("italic") ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  <Italic size={16} />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1 self-center"></div>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={`p-2 rounded transition-colors ${editor.isActive("bulletList") ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  <List size={16} />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1 self-center"></div>
                <button
                  type="button"
                  onClick={() => {
                    const url = window.prompt("URL du lien :");
                    if (url)
                      editor.chain().focus().setLink({ href: url }).run();
                  }}
                  className={`p-2 rounded transition-colors ${editor.isActive("link") ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  <LinkIcon size={16} />
                </button>
                <button
                  type="button"
                  onClick={addImage}
                  className="p-2 rounded transition-colors text-slate-500 hover:bg-slate-100"
                >
                  <ImageIcon size={16} />
                </button>
              </div>
            )}

            {/* ZONE DE TEXTE */}
            <EditorContent
              editor={editor}
              disabled={isSendingMail}
              className="bg-white"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSendingMail}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl font-bold cursor-pointer"
        >
          {isSendingMail ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : (
            <Send size={18} className="mr-2" />
          )}
          {isSendingMail ? "Envoi en cours..." : "Envoyer la campagne"}
        </Button>
      </form>
    </div>
  );
}
