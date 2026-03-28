import { useState, useRef } from "react";
import {
  Send,
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  X,
  UploadCloud,
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

  // États pour nos belles Modales
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
    ],
    content: "<p>Bonjour à tous,</p><p>Voici les dernières nouveautés...</p>",
    editorProps: {
      attributes: {
        // 🚀 MAGIE ICI : On force les listes avec [&_ul]:list-disc
        class:
          "prose max-w-none p-5 min-h-[300px] outline-none text-slate-800 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-1",
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

  // --- ACTIONS MODALES ---
  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setIsLinkModalOpen(false);
    }
  };

  const addImageFromUrl = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setIsImageModalOpen(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    const toastId = toast.loading("Envoi de l'image...");
    try {
      const res = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // On insère l'URL retournée par le backend
      editor.chain().focus().setImage({ src: res.data.url }).run();
      toast.success("Image insérée !", { id: toastId });
      setIsImageModalOpen(false);
    } catch (err) {
      toast.error("Échec de l'envoi.", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-md max-w-4xl relative">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Send className="text-blue-600" /> Envoyer une Newsletter
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
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            placeholder="Ex: Grosse mise à jour sur BibleGraph ! 🎉"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Corps du message (HTML)
          </label>
          <div className="w-full bg-white border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
            {/* BARRE D'OUTILS */}
            {editor && (
              <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded transition-colors cursor-pointer ${editor.isActive("bold") ? "bg-slate-300 text-slate-900" : "text-slate-600 hover:bg-slate-200"}`}
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded transition-colors cursor-pointer ${editor.isActive("italic") ? "bg-slate-300 text-slate-900" : "text-slate-600 hover:bg-slate-200"}`}
                >
                  <Italic size={16} />
                </button>
                <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>
                <button
                  type="button"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={`p-2 rounded transition-colors cursor-pointer ${editor.isActive("bulletList") ? "bg-slate-300 text-slate-900" : "text-slate-600 hover:bg-slate-200"}`}
                >
                  <List size={16} />
                </button>
                <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(true)}
                  className={`p-2 rounded transition-colors cursor-pointer ${editor.isActive("link") ? "bg-slate-300 text-slate-900" : "text-slate-600 hover:bg-slate-200"}`}
                >
                  <LinkIcon size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="p-2 rounded transition-colors text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  <ImageIcon size={16} />
                </button>
              </div>
            )}

            {/* ZONE DE TEXTE */}
            <EditorContent editor={editor} disabled={isSendingMail} />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSendingMail}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl font-bold cursor-pointer shadow-md"
        >
          {isSendingMail ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : (
            <Send size={18} className="mr-2" />
          )}
          {isSendingMail ? "Envoi en cours..." : "Envoyer la campagne"}
        </Button>
      </form>

      {/* --- MODALE LIEN --- */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setIsLinkModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <LinkIcon size={18} className="text-blue-500" /> Ajouter un lien
            </h3>
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              autoFocus
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <Button
              onClick={addLink}
              className="w-full bg-blue-600 text-white cursor-pointer"
            >
              Valider
            </Button>
          </div>
        </div>
      )}

      {/* --- MODALE IMAGE --- */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ImageIcon size={18} className="text-blue-500" /> Insérer une
              image
            </h3>

            {/* OPTION 1 : UPLOAD */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Charger depuis votre appareil
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                className="w-full border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2
                    className="animate-spin text-blue-500 mb-2"
                    size={24}
                  />
                ) : (
                  <UploadCloud className="text-blue-500 mb-2" size={24} />
                )}
                <span className="font-semibold">
                  {isUploading ? "Envoi..." : "Cliquez pour uploader une image"}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs font-bold text-slate-400 uppercase">
                Ou
              </span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {/* OPTION 2 : URL */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Depuis un lien internet (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={addImageFromUrl}
                  variant="outline"
                  className="cursor-pointer border-slate-300"
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
