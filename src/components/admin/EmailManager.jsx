import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  Send,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  Inbox,
  RefreshCw,
  Trash2,
  ArrowLeft,
  Reply,
  Calendar,
  User,
} from "lucide-react";

export default function EmailManager() {
  const [activeTab, setActiveTab] = useState("compose");
  const [inboxMessages, setInboxMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  // --- FETCH INBOX ---
  useEffect(() => {
    if (activeTab === "inbox") fetchInbox();

    const subscription = supabase
      .channel("inbox_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "inbox_messages" },
        (payload) => setInboxMessages((prev) => [payload.new, ...prev]),
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [activeTab]);

  const fetchInbox = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("inbox_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setInboxMessages(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    await supabase.from("inbox_messages").delete().eq("id", id);
    if (selectedMessage?.id === id) setSelectedMessage(null);
    fetchInbox();
  };

  // --- REPLY LOGIC ---
  const handleReply = (msg) => {
    const dateStr = new Date(msg.created_at).toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const quoteHeader = `\n\n\n\n--------------------------------------------------\nOn ${dateStr}, ${msg.sender} wrote:\n\n`;
    const originalBody = msg.body_text || "No text content.";

    setFormData({
      to: msg.sender.replace(/.*<([^>]+)>/, "$1"), // Extract just the email if formatted like "Name <email>"
      subject: msg.subject?.startsWith("Re:")
        ? msg.subject
        : `Re: ${msg.subject || "No Subject"}`,
      message: quoteHeader + originalBody,
    });

    setSelectedMessage(null);
    setActiveTab("compose");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert newlines to HTML breaks so it renders properly in our Edge Function template
      const formattedMessage = formData.message.replace(/\n/g, "<br>");

      const { error } = await supabase.functions.invoke("send-email", {
        body: {
          to: formData.to,
          subject: formData.subject,
          html: formattedMessage, // This triggers the custom HTML block in your send-email edge function
        },
      });

      if (error) throw error;
      setStatus("success");
      setFormData({ to: "", subject: "", message: "" });
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* MAIN CONTENT AREA */}
      <div className="lg:col-span-2 bg-white rounded shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
        {/* SUB-TABS */}
        <div className="flex border-b border-gray-200 flex-shrink-0 bg-gray-50">
          <button
            onClick={() => setActiveTab("compose")}
            className={`flex-1 p-4 font-oswald uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === "compose"
                ? "bg-white text-[#ce2a34] border-t-2 border-[#ce2a34]"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Send size={16} /> Compose
          </button>
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex-1 p-4 font-oswald uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === "inbox"
                ? "bg-white text-[#ce2a34] border-t-2 border-[#ce2a34]"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Inbox size={16} /> Inbox
          </button>
        </div>

        {/* --- COMPOSE TAB --- */}
        {activeTab === "compose" && (
          <form
            onSubmit={handleSend}
            className="p-6 space-y-6 flex-1 overflow-y-auto"
          >
            {status === "success" && (
              <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded font-bold uppercase tracking-wide text-sm flex gap-2">
                <CheckCircle size={18} /> Message Dispatched
              </div>
            )}
            {status === "error" && (
              <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded font-bold uppercase tracking-wide text-sm flex gap-2">
                <AlertCircle size={18} /> Error sending email.
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                To
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded font-body text-sm focus:border-[#1b1b1b] outline-none"
                value={formData.to}
                onChange={(e) =>
                  setFormData({ ...formData, to: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded font-body text-sm focus:border-[#1b1b1b] outline-none"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Message
              </label>
              <textarea
                rows={12}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:border-[#1b1b1b] outline-none resize-none font-mono text-sm"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                disabled={loading}
                className="px-8 py-3 bg-[#ce2a34] text-white font-oswald uppercase tracking-widest rounded hover:bg-[#1b1b1b] transition-colors flex gap-2 items-center shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                Send Dispatch
              </button>
            </div>
          </form>
        )}

        {/* --- INBOX TAB --- */}
        {activeTab === "inbox" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedMessage ? (
              // --- DETAIL VIEW ---
              <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#ce2a34] font-mono text-sm uppercase transition-colors"
                  >
                    <ArrowLeft size={16} /> Back to List
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="bg-gray-50 rounded p-6 mb-6 border border-gray-200">
                  <h2 className="text-xl font-oswald uppercase text-[#1b1b1b] mb-4">
                    {selectedMessage.subject}
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-body text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#1b1b1b] text-white flex items-center justify-center font-bold">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-[#1b1b1b]">
                          {selectedMessage.sender}
                        </p>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">
                          Client Email
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 bg-white px-3 py-1.5 rounded border border-gray-200 font-mono text-xs">
                      <Calendar size={14} />
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-white rounded border border-gray-200 p-6 shadow-inner mb-6 min-h-[200px]">
                  {selectedMessage.body_html ? (
                    <div
                      className="prose max-w-none text-gray-700 font-body text-sm leading-relaxed email-content"
                      dangerouslySetInnerHTML={{
                        __html: selectedMessage.body_html,
                      }}
                    />
                  ) : (
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap font-body text-sm leading-relaxed">
                      {selectedMessage.body_text ||
                        "No text content available."}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    className="px-6 py-3 bg-[#1b1b1b] text-white font-oswald uppercase tracking-widest rounded flex items-center gap-2 hover:bg-[#ce2a34] transition-colors shadow-md"
                  >
                    <Reply size={18} /> Reply to Thread
                  </button>
                </div>
              </div>
            ) : (
              // --- LIST VIEW ---
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                  <h3 className="font-oswald uppercase tracking-widest text-[#1b1b1b] flex items-center gap-2">
                    <Inbox size={18} className="text-[#ce2a34]" /> Inbox Feed
                  </h3>
                  <button
                    onClick={fetchInbox}
                    className="p-2 text-gray-400 hover:text-[#ce2a34] transition-all"
                    title="Refresh"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>

                {!loading && inboxMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Inbox size={48} className="mb-4 opacity-20" />
                    <p className="font-mono text-sm uppercase">
                      No communications found.
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="flex justify-center p-12 text-[#ce2a34]">
                    <Loader2 className="animate-spin" size={32} />
                  </div>
                )}

                <div className="divide-y divide-gray-100">
                  {inboxMessages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className="p-5 hover:bg-gray-50 transition-colors cursor-pointer group flex gap-4 items-start"
                    >
                      <div className="w-10 h-10 rounded bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0 font-oswald text-lg mt-1">
                        {msg.sender.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-bold text-[#1b1b1b] truncate pr-2 text-sm">
                            {msg.sender}
                          </span>
                          <span className="text-xs font-mono text-gray-400 flex-shrink-0">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#ce2a34] mb-1 truncate">
                          {msg.subject || "(No Subject)"}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2 font-body">
                          {msg.body_text}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center self-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(msg.id);
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SIDEBAR INFO */}
      <div className="space-y-6">
        <div className="bg-[#1b1b1b] text-white rounded p-6 shadow-md border-t-4 border-[#ce2a34]">
          <Mail className="h-8 w-8 text-[#ce2a34] mb-4" />
          <h4 className="font-oswald text-xl uppercase tracking-widest mb-3 border-b border-gray-700 pb-2">
            Communications
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed font-body">
            <strong className="text-white">Outgoing:</strong> Processed via
            Resend API.
            <br />
            <br />
            <strong className="text-white">Incoming:</strong> Emails sent to
            your domain are caught via Webhook and displayed instantly here.
          </p>
        </div>

        <div className="bg-white rounded border border-gray-200 p-6 shadow-sm">
          <h4 className="font-oswald uppercase text-[#1b1b1b] tracking-wide mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-[#ce2a34]" /> Pro Tip
          </h4>
          <p className="text-sm text-gray-600 font-body">
            When you click <strong>Reply to Thread</strong>, the system
            automatically quotes the client's original message and formats your
            response using the Obsidian Labs HTML template.
          </p>
        </div>
      </div>
    </div>
  );
}
